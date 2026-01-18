export type Provider = {
  google?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean;
  };

  openai?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean;
  };
 
  deepseek?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean;
  };
 
  mistral?: {
    model: string;
    prompt: string;
    system?: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
    stream?: boolean;
  };

}


export type Output = {
  data: string;
  provider: string;
  model: string;
  raw?: any;
}
