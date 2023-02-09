import { CrawlerConfig } from "./config";

export interface CrawlingResult {
  count: number;
}

export interface CrawlerModule {
  key: string;
  crawling: () => Promise<CrawlingResult>;
  config: CrawlerConfig;
}
