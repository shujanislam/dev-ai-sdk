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

export async function googleCoreProvider(provider: Provider, apiKey: string): Promise<Output> {
  if (!provider.google) {
    throw new SDKError('google provider config missing', 'google', 'CONFIG_ERROR');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${provider.google.model}:generateContent`;
  const inputText = `${provider.google.system ?? ''} ${provider.google.prompt}`;
  const tools = toGoogleTools(provider.google.tool);

  const res = await fetch(
    url,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: inputText,
              },
            ],
          },
        ],
        tools,
        generationConfig: {
          temperature: provider.google.temperature,
          maxOutputTokens: provider.google.maxTokens,
        },
      }),
    },
  );

  const rawData = await res.json();

  if (!res.ok) {
    const msg = rawData?.error?.message ?? 'Gemini error';
     throw new SDKError(`Gemini error ${msg}`, 'google', 'API_ERROR');
  }

  const functionCall = getFunctionCall(rawData);

  if (functionCall) {
    const toolResult = await executeTool(
      provider.google.tool,
      functionCall.name,
      functionCall.args ?? {},
    );

    const finalRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: inputText,
              },
            ],
          },
          rawData.candidates?.[0]?.content,
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
        generationConfig: {
          temperature: provider.google.temperature,
          maxOutputTokens: provider.google.maxTokens,
        },
      }),
    });

    const finalRawData = await finalRes.json();

    if (!finalRes.ok) {
      const msg = finalRawData?.error?.message ?? 'Gemini error';
      throw new SDKError(`Gemini error ${msg}`, 'google', 'API_ERROR');
    }

    const finalData = getText(finalRawData);

    if (provider.google.raw === true) {
      return {
        data: finalData,
        provider: 'google',
        model: provider.google.model,
        raw: finalRawData,
      };
    }

    return {
      data: finalData,
      provider: 'google',
      model: provider.google.model,
    };
  }

  const data = getText(rawData);

  if (provider.google.raw === true) {
    return {
      data,
      provider: 'google',
      model: provider.google.model,
      raw: rawData,
    };
  }

  return {
    data,
    provider: 'google',
    model: provider.google.model,
  };
}
