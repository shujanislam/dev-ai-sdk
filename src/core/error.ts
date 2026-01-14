export class SDKError extends Error {
  provider: string;
  message: string;

  constructor(message: string, provider?: string){
    super(message);
    this.provider = provider;
    this.message = message;
  }
}
