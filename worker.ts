interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const LOCALES = ['ru', 'en'] as const;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // /pikto and /pikto/ → redirect to /ru/pikto/
    if (/^\/pikto\/?$/.test(pathname)) {
      return Response.redirect(new URL('/ru/pikto/', url.origin).toString(), 302);
    }

    // /ru/pikto/... or /en/pikto/... → strip locale prefix and serve asset
    for (const locale of LOCALES) {
      const prefix = `/${locale}/pikto`;
      if (pathname.startsWith(prefix)) {
        const remaining = pathname.slice(prefix.length);
        if (remaining === '' || remaining === '/') {
          url.pathname = locale === 'ru' ? '/' : `/${locale}/`;
        } else {
          url.pathname = remaining;
        }
        return env.ASSETS.fetch(new Request(url.toString(), request));
      }
    }

    // /pikto/assets/... → strip /pikto prefix and serve asset
    url.pathname = pathname.replace(/^\/pikto/, '') || '/';
    return env.ASSETS.fetch(new Request(url.toString(), request));
  },
};
