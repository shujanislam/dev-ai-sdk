import type { ErrorType } from '../types/error.types'

export class SDKError extends Error {
  provider: string;
  code: string; 

  constructor(message: string, provider: string, code: string) {
    super(message);
    
    this.name = 'SDKError';
    this.provider = provider;
    this.code = code;
  }

  toErrorType(): ErrorType {
    return {
      name: this.name,
      provider: this.provider,
      code: this.code,
      message: this.message,
    };
  }
}
