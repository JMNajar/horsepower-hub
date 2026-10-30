// Password-protects private pages on the server, before any HTML is sent.
// The password lives in the Vercel env var ROADWEAR_PASSWORD (not in this repo).
// Any username works; only the password is checked.
export const config = {
  matcher: ['/roadwear-dashboard', '/roadwear-dashboard/:path*', '/vcg-dashboard', '/vcg-dashboard/:path*', '/hq', '/hq/:path*', '/pod', '/pod/:path*', '/chopper-giveaway', '/chopper-giveaway/:path*', '/api/checklist'],
};

export default function middleware(request) {
  const expected = process.env.ROADWEAR_PASSWORD;
  const header = request.headers.get('authorization') || '';
  if (expected && header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(':') + 1);
      if (password === expected) return; // allowed: continue to the page
    } catch (e) {
      // fall through to the prompt
    }
  }
  return new Response('Password required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Roadwear Dashboard", charset="UTF-8"',
      'Cache-Control': 'no-store',
    },
  });
}
