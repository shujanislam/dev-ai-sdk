import type { Provider, Output, StreamOutput, CouncilProvider, CouncilDecision } from './types/types';
import { googleCoreProvider } from './providers/google-core';
import { googleStreamProvider } from './providers/google-stream';
import { openaiProvider } from './providers/openai';
import { openaiStreamProvider } from './providers/openai-stream';
import { deepseekProvider } from './providers/deepseek';
import { deepseekStreamProvider } from './providers/deepseek-stream';
import { mistralProvider } from './providers/mistral';
import { mistralStreamProvider } from './providers/mistral-stream';
import { anthropicProvider } from './providers/anthropic';
import { SDKError } from './core/error';
import { validateConfig, validateProvider } from './core/validate';
import type { SDKConfig } from './core/config';
import { fallbackEngine } from './core/fallbackEngine';
import { councilCourt } from './core/council';

export class genChat{
  private sdkConfig: SDKConfig;
  
  constructor(sdkConfig: SDKConfig) {
    validateConfig(sdkConfig);
 
    this.sdkConfig = {
      google: sdkConfig.google ? { ...sdkConfig.google } : undefined,
      openai: sdkConfig.openai ? { ...sdkConfig.openai } : undefined,
      deepseek: sdkConfig.deepseek ? { ...sdkConfig.deepseek } : undefined,
      mistral: sdkConfig.mistral ? { ...sdkConfig.mistral } : undefined,
      anthropic: sdkConfig.anthropic ? { ...sdkConfig.anthropic } : undefined,
      fallback: sdkConfig.fallback,
    };
  }
 
   async generate(provider: Provider): Promise<Output | AsyncGenerator<StreamOutput>> {
    validateProvider(provider);
    
    try {
      if (provider.google) {
        if (provider.google.stream === true) {
          return googleStreamProvider(provider, this.sdkConfig.google!.apiKey);
        }
        return await googleCoreProvider(provider, this.sdkConfig.google!.apiKey);
      }
 
      if (provider.openai) {
        if (provider.openai.stream === true) {
          return openaiStreamProvider(provider, this.sdkConfig.openai!.apiKey);
        }
        return await openaiProvider(provider, this.sdkConfig.openai!.apiKey);
      }
 
      if (provider.deepseek) {
        if (provider.deepseek.stream === true) {
          return deepseekStreamProvider(provider, this.sdkConfig.deepseek!.apiKey);
        }
        return await deepseekProvider(provider, this.sdkConfig.deepseek!.apiKey);
      }
 
      if (provider.mistral) {
        if (provider.mistral.stream === true) {
          return mistralStreamProvider(provider, this.sdkConfig.mistral!.apiKey);
        }
        return await mistralProvider(provider, this.sdkConfig.mistral!.apiKey);
      }
 
       if (provider.anthropic) {
         if (provider.anthropic.stream === true) {
           throw new SDKError('Streaming not yet supported for Anthropic', 'anthropic', 'STREAMING_NOT_SUPPORTED');
         }
         return await anthropicProvider(provider, this.sdkConfig.anthropic!.apiKey);
       }

       throw new SDKError('No provider passed', 'core', 'NO_PROVIDER');
    } catch (err) {
      const isStreaming =
        provider.google?.stream === true ||
        provider.openai?.stream === true ||
        provider.deepseek?.stream === true ||
        provider.mistral?.stream === true ||
        provider.anthropic?.stream === true;

      if (
        !isStreaming &&
        err instanceof SDKError &&
        this.sdkConfig.fallback === true
      ) {
        // non-streaming calls can use fallback engine
        return await fallbackEngine(err.provider, this.sdkConfig, provider);
      }
      
      if (err instanceof SDKError) {
        throw err;
      }
 
       throw new SDKError('Unexpected Error', 'core', 'UNEXPECTED_ERROR');
    }
  }

      async councilGenerate(councilProvider: CouncilProvider): Promise<CouncilDecision> {
        try {
          const judge = this.extractAgent(councilProvider.judge);
          
          const members = this.extractAgents(councilProvider.members);
          
          if (members.length === 0) {
            throw new SDKError('At least one member agent is required', 'core', 'NO_MEMBERS');
          }
         
          // Call all member agents in parallel with the prompt
          const memberResponses = await Promise.all(
            members.map(member => 
              this.generate({
                [member.provider]: {
                  model: member.model,
                  prompt: councilProvider.prompt,
                  system: councilProvider.system
                }
              })
            )
          );

          console.log('Member Responses:', memberResponses);
          console.log('Judge:', judge);

          // TODO: Ask judge to pick the best response
          // For now, just return the first response
          throw new SDKError('Judge evaluation not yet implemented', 'core', 'NOT_IMPLEMENTED');
        } catch (err) {
          if (err instanceof SDKError) {
            throw err;
          }
          throw new SDKError('Unexpected Error in council generation', 'core', 'UNEXPECTED_ERROR');
        }
      }

    private extractAgent(agent: any): { provider: string; model: string } | null {
      if (agent.google) {
        return { provider: 'google', model: agent.google };
      }
      if (agent.openai) {
        return { provider: 'openai', model: agent.openai };
      }
      if (agent.deepseek) {
        return { provider: 'deepseek', model: agent.deepseek };
      }
      if (agent.mistral) {
        return { provider: 'mistral', model: agent.mistral };
      }
      if (agent.anthropic) {
        return { provider: 'anthropic', model: agent.anthropic };
      }
      
      return null;
    }

    private extractAgents(agents: any[]): Array<{ provider: string; model: string }> {
      const extractedAgents: Array<{ provider: string; model: string }> = [];
      
      agents.forEach((agent) => {
        const extracted = this.extractAgent(agent);
        if (extracted) {
          extractedAgents.push(extracted);
        }
      });
      
      return extractedAgents;
    }
}

