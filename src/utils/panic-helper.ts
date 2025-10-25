// biome-ignore lint/suspicious/noExplicitAny: allows flexible logging with arbitrary args
export const shouldNeverHappen = (msg?: string, ...args: any[]): never => {
  console.error(msg, ...args);
  if (process.env.NODE_ENV !== 'production') {
    // biome-ignore lint/suspicious/noDebugger: intentional use for development-time debugging
    debugger;
  }

  throw new Error(`This should never happen: ${msg}`);
};
