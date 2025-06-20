export interface Post {
  id: string;
  message: string;
  created_at: string;
  alias: string;
  first_name: string;
  last_name: string;
  likes: string;
}

export interface PostFormData {
  message: string;
}