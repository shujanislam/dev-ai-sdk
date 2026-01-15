export type Provider = {
  model: string;
  prompt: string;
  raw?: boolean;
}

export type Output = {
  data: string;
  provider: string;
  model: string;
  raw?: any;
}
