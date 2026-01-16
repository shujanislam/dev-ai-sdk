export type Provider = {
  google? : {
    model: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
  };

  openai? : {
    model: string;
    prompt: string;
    temperature?: number;
    maxTokens?: number;
    raw?: boolean;
  };
}

export type Output = {
  data: string;
  provider: string;
  model: string;
  raw?: any;
}
