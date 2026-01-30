export type SDKConfig = {
  google?: {
    apiKey: string;
  };

  openai?: {
    apiKey: string;
  };

  deepseek?: {
    apiKey: string;
  };

  mistral?: {
    apiKey: string;
  };

  anthropic?: {
    apiKey: string;
  };
  
  fallback?: boolean;
};

