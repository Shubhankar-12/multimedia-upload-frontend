"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MediaFile } from "@/lib/types";
import { deleteFile, incrementViewCount } from "@/lib/api";
import { ShareDialog } from "@/components/ShareDialog";
import {
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Share2,
} from "lucide-react";

interface FileCardProps {
  file: MediaFile;
  onUpdate: () => void;
}

export function FileCard({ file, onUpdate }: FileCardProps) {
  const [loading, setLoading] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return <ImageIcon className="h-8 w-8 text-blue-500" />;
    if (type.startsWith("video/"))
      return <Video className="h-8 w-8 text-purple-500" />;
    if (type.startsWith("audio/"))
      return <Music className="h-8 w-8 text-green-500" />;
    if (type === "application/pdf")
      return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const handleView = async () => {
    try {
      await incrementViewCount(file.file_id);
      window.open(file.url, "_blank");
      onUpdate();
    } catch (error) {
      console.error("Failed to increment view count:", error);
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    setLoading(true);
    try {
      await deleteFile(file.file_id);
      onUpdate();
    } catch (error) {
      console.error("Failed to delete file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="group hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {file.type.startsWith("image/") ? (
              <Image
                src={file.url || "/placeholder.svg"}
                alt={file.name}
                width={300}
                height={200}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : file.type.startsWith("video/") ? (
              <video
                src={file.url}
                className="w-full h-full object-cover"
                controls={false}
                muted
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => e.currentTarget.pause()}
              />
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                {getFileIcon(file.type)}
                <span className="text-xs text-gray-500 text-center px-2">
                  {file.name}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-sm truncate flex-1 mr-2">
                {file.name}
              </h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsShareOpen(true)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDelete} disabled={loading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatFileSize(file.size)}</span>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{file.viewCount}</span>
              </div>
            </div>

            {file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {file.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{file.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ShareDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        fileId={file.file_id}
        fileName={file.name}
      />
    </>
  );
}
