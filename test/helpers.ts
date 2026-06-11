import { vi } from 'vitest';

export function jsonResponse(data: unknown, ok = true, status = ok ? 200 : 500) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  };
}

export function streamResponse(chunks: string[], ok = true, status = ok ? 200 : 500) {
  const encoder = new TextEncoder();
  const encodedChunks = chunks.map((chunk) => encoder.encode(chunk));

  return {
    ok,
    status,
    body: {
      getReader() {
        let index = 0;
        return {
          read: vi.fn().mockImplementation(async () => {
            if (index >= encodedChunks.length) {
              return { done: true, value: undefined };
            }

            return { done: false, value: encodedChunks[index++] };
          }),
        };
      },
    },
    json: vi.fn().mockResolvedValue({ error: { message: 'stream failed' } }),
  };
}

export async function collectStream<T>(stream: AsyncIterable<T>) {
  const values: T[] = [];

  for await (const value of stream) {
    values.push(value);
  }

  return values;
}
