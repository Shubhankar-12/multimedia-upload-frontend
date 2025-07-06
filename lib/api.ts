import type { MediaFile, AuthResponse } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const loginApi = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
};

export const registerApi = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  return response.json();
};

export const fetchFiles = async ({
  search,
  sort,
  filter,
}: {
  search: string;
  sort: string;
  filter: string;
}): Promise<MediaFile[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/files?search=${search || ""}&sort=${sort || ""}&filter=${
      filter || ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch files");
  }

  const files = await response.json();
  return files.result;
};

export const uploadFile = async (
  file: File,
  tags: string[]
): Promise<MediaFile> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("document", file);
  formData.append("tags", JSON.stringify(tags));

  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  return response.json();
};

export const deleteFile = async (fileId: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/files/delete?file_id=${fileId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
};

export const incrementViewCount = async (fileId: string): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/files/update_view_count?file_id=${fileId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to increment view count");
  }
};
