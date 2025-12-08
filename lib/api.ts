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

  const json = await response.json();

  // CRITICAL: Extract from response.data[0].paginatedResults
  // Support both direct array body or { data: [...] } wrapper for robustness
  console.log("json", json);

  const data = json.result;
  console.log("json.data", data);

  if (Array.isArray(data) && data.length > 0) {
    return data;
  }
  return [];
};

export const uploadFile = async (
  files: File[],
  tags: string[]
): Promise<MediaFile[]> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("documents", file);
  });

  formData.append("tags", JSON.stringify(tags));

  const response = await fetch(`${API_BASE_URL}/files/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload files");
  }

  const data = await response.json();
  // Handle case where backend returns { result: MediaFile[], metadata: ... }
  if (data.result && Array.isArray(data.result)) {
    return data.result;
  }
  return Array.isArray(data) ? data : [];
};

export const shareFile = async (
  fileId: string,
  email: string
): Promise<void> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/files/${fileId}/share`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to share file");
  }
};

export const generateLink = async (
  fileId: string
): Promise<{ url: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/files/${fileId}/link`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate link");
  }

  return response.json();
};

export const getSharedFile = async (token: string): Promise<MediaFile> => {
  const authToken = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/shared/${token}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Unauthorized");
    }
    throw new Error("Failed to fetch shared file");
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

export const fetchCurrentUser = async (): Promise<AuthResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch current user");
  }

  return response.json();
};
