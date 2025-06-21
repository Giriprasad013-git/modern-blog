
export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  date: string;
  read_time: number;
  views: number;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}
