export interface Article {
  article_id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  urlToImage: string;
  category: string;
  url: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ChatMessage {
  article_id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  articleId?: string;
}