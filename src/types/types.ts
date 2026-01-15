export type Provider = {
  google? : {
    model: string;
    prompt: string;
    raw?: boolean;
  };

  openai? : {
    model: string;
    prompt: string;
    raw?: boolean;
  };
}

export type Output = {
  data: string;
  provider: string;
  model: string;
  raw?: any;
}
