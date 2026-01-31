import { XMLParser } from 'fast-xml-parser';

export interface RSSItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
  category?: string | string[];
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  items: RSSItem[];
}

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

export async function fetchRSSFeed(url: string): Promise<RSSFeed> {
  try {
    // Use CORS proxy for web to avoid CORS issues
    const fetchUrl = process.env.EXPO_OS === 'web'
      ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
      : url;

    const response = await fetch(fetchUrl);
    const xml = await response.text();
    const result = parser.parse(xml);

    const channel = result.rss.channel;
    const items = Array.isArray(channel.item) ? channel.item : [channel.item];

    return {
      title: channel.title,
      description: channel.description,
      link: channel.link,
      items: items.map((item: any) => ({
        title: item.title,
        link: item.link,
        description: item.description || '',
        pubDate: item.pubDate,
        guid: item.guid?.['#text'] || item.guid || item.link,
        category: item.category,
      })),
    };
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
