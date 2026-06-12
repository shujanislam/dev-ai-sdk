import type { Provider, Output, ToolConfig } from '../types/types';
import { SDKError } from '../core/error';
import { executeTool } from '../core/tools';

function toGoogleTools(tools: ToolConfig[] | undefined) {
  if (!tools?.length) return undefined;

  return [
    {
      functionDeclarations: tools.map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      })),
    },
  ];
}

function getText(data: any): string {
  return data.candidates?.[0]?.content?.parts
    ?.map((part: any) => part.text ?? '')
    .join('') ?? '';
}

function getFunctionCall(data: any) {
  return data.candidates?.[0]?.content?.parts?.find((part: any) => part.functionCall)?.functionCall;
}

function toOutput(data: string, rawData: any, provider: Provider): Output {
  if (!provider.google) {
    throw new SDKError('google provider config missing', 'google', 'CONFIG_ERROR');
  }

  const output: Output = {
    data,
    provider: 'google',
    model: provider.google.model,
  };

  if (provider.google.raw === true) {
    output.raw = rawData;
  }

  return output;
}

async function generateGeminiContent(url: string, apiKey: string, body: Record<string, any>) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message ?? 'Gemini error';
    throw new SDKError(`Gemini error ${msg}`, 'google', 'API_ERROR');
  }

  return data;
}

export async function googleCoreProvider(provider: Provider, apiKey: string): Promise<Output> {
  if (!provider.google) {
    throw new SDKError('google provider config missing', 'google', 'CONFIG_ERROR');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:generateContent`;
  const inputText = `${provider.google.system ?? ''} ${provider.google.prompt}`;
  const tools = toGoogleTools(provider.google.tool);
  const generationConfig = {
    temperature: provider.google.temperature,
    maxOutputTokens: provider.google.maxTokens,
  };
  const userContent = {
    role: 'user',
    parts: [
      {
        text: inputText,
      },
    ],
  };

  const rawData = await generateGeminiContent(url, apiKey, {
    contents: [userContent],
    tools,
    generationConfig,
  });

  const functionCall = getFunctionCall(rawData);

  if (functionCall) {
    if (!functionCall.name) {
      throw new SDKError('Gemini function call missing tool name', 'google', 'TOOL_CALL_ERROR');
    }

    const toolResult = await executeTool(
      provider.google.tool,
      functionCall.name,
      functionCall.args ?? {},
    );

    const modelContent = rawData.candidates?.[0]?.content;

    if (!modelContent) {
      throw new SDKError('Gemini function call missing model content', 'google', 'TOOL_CALL_ERROR');
    }

    const finalRawData = await generateGeminiContent(url, apiKey, {
      contents: [
        userContent,
        modelContent,
        {
          role: 'function',
          parts: [
            {
              functionResponse: {
                name: functionCall.name,
                response: {
                  result: toolResult,
                },
              },
            },
          ],
        },
      ],
      tools,
      generationConfig,
    });

    const finalData = getText(finalRawData);
    return toOutput(finalData, finalRawData, provider);
  }

  const data = getText(rawData);
  return toOutput(data, rawData, provider);
}
