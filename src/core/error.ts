export class SDKError extends Error {
  provider: string;

  constructor(message: string, provider: string) {
    super(message);
    this.provider = provider;
  }
}
