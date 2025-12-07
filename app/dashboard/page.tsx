"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { FileUploadForm } from "@/components/FileUploadForm";
import { SearchBar } from "@/components/SearchBar";
import { FileGrid } from "@/components/FileGrid";
import { useAppSelector } from "@/lib/hooks";
import type { MediaFile } from "@/lib/types";
import { fetchFiles } from "@/lib/api";
import useDebounce from "@/hooks/use-debounce";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [sortBy, setSortBy] = useState("created_at"); // or "viewCount"
  const [typeFilter, setTypeFilter] = useState(""); // "image", "video", etc.
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    loadFiles();
  }, [isAuthenticated, router]);

  useEffect(() => {
    loadFiles();
  }, [debouncedSearch, sortBy, typeFilter]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const data = await fetchFiles({
        search: debouncedSearch,
        sort: sortBy,
        filter: typeFilter,
      });
      console.log("data", data);
      setFiles(data);
      // setFilteredFiles(data);
    } catch (error) {
      console.error("Failed to load files:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploaded = (newFiles: MediaFile[]) => {
    setFiles((prev) => [...newFiles, ...prev]);
    // setFilteredFiles((prev) => [...newFiles, ...prev]);
  };

  if (!isAuthenticated) {
    return null;
  }

  const clearFilters = () => {
    setSortBy("created_at");
    setTypeFilter("");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Upload, organize, and search your media files
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FileUploadForm onFileUploaded={handleFileUploaded} />
          </div>

          <div className="lg:col-span-2">
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search files by name or tags..."
              />
            </div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex gap-4">
                {/* Sort By Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Sort by: Newest</SelectItem>
                    <SelectItem value="viewCount">Sort by: Views</SelectItem>
                    <SelectItem value="size">Sort by: Size</SelectItem>
                  </SelectContent>
                </Select>

                {/* Type Filter Dropdown */}
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="image">Images</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="pdf">PDFs</SelectItem>
                    <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            </div>
            <FileGrid
              files={files}
              loading={loading}
              onFileUpdate={loadFiles}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
