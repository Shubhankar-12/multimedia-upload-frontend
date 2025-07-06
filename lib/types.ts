export interface MediaFile {
  file_id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}
