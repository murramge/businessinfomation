import { CrawlerConfig } from "./config";

export interface CrawlingResult {
  count: number;
}

export interface CrawlerModule {
  key: string;
  crawling: (q: any) => Promise<CrawlingResult>;
  config: CrawlerConfig;
}
