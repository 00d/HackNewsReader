// Hacker News API types based on official Firebase API

export type FeedType = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export type ItemType = 'story' | 'comment' | 'job' | 'poll' | 'pollopt';

export interface HNItem {
  id: number;
  deleted?: boolean;
  type: ItemType;
  by?: string;
  time: number;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export interface Story extends HNItem {
  type: 'story' | 'job';
  title: string;
  score?: number;
  descendants?: number;
}

export interface Comment extends HNItem {
  type: 'comment';
  parent: number;
  text?: string;
}

export interface HNUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}
