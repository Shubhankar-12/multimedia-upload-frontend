export interface MediaFile {
  file_id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  tags: string[];
  viewCount: number;
  view_count?: number; // Backend compatibility
  createdAt: string;
  created_at?: string; // Backend compatibility
  updatedAt: string;
  updated_at?: string; // Backend compatibility
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
