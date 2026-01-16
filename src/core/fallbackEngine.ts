import type { Provider, Output } from '../types/types';
import { googleProvider } from '../providers/google';
import { openaiProvider } from '../providers/openai';
import { deepseekProvider } from '../providers/deepseek';
import { mistralProvider } from '../providers/mistral';
import { SDKError } from './error';
import { validateConfig, validateProvider } from './validate';
import type { SDKConfig } from './config';

export function fallbackEngine(): string{
  console.log('fallback working');
  return '';
}
