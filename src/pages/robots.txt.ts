import { SITE } from '../lib/site';
export function GET() {
  const body = `# Orkhon Atlas welcomes search engines and AI assistants.\nUser-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap-index.xml\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
