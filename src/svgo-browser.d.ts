declare module 'svgo/dist/svgo.browser.js' {
  export function optimize(
    source: string,
    config?: {
      js2svg?: {
        pretty?: boolean;
        indent?: number;
      };
      plugins?: Array<string | { name: string; params?: Record<string, unknown> }>;
    },
  ): {
    data: string;
  };
}
