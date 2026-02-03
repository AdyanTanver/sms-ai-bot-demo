import Firecrawl from '@mendable/firecrawl-js';

let firecrawl: Firecrawl | null = null;

function getFirecrawl(): Firecrawl {
  if (!firecrawl) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }
    firecrawl = new Firecrawl({ apiKey });
  }
  return firecrawl;
}

export interface ScrapeResult {
  companyName: string;
  content: string;
  favicon?: string;
}

export async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  const result = await getFirecrawl().scrape(url, {
    formats: ['markdown'],
    onlyMainContent: true,
  });

  const title = result.metadata?.title || '';
  const companyName = extractCompanyName(title, url);
  
  return {
    companyName,
    content: (result.markdown || '').slice(0, 30000),
    favicon: result.metadata?.favicon || result.metadata?.ogImage,
  };
}

function extractCompanyName(title: string, url: string): string {
  if (title) {
    const parts = title.split(/[|\-–—]/);
    if (parts.length > 0) {
      return parts[0].trim();
    }
    return title.trim();
  }
  
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, '').split('.')[0];
  } catch {
    return 'Your Company';
  }
}
