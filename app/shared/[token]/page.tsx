"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSharedFile } from "@/lib/api";
import { MediaFile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Loader2, Download, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";

export default function SharedFilePage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [file, setFile] = useState<MediaFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const data = await getSharedFile(token);
        setFile(data);
      } catch (err: any) {
        if (err.message === "Unauthorized") {
          // Redirect to login if unauthorized, storing return URL could be a nice touch
          router.push(`/login?redirect=/shared/${token}`);
          return;
        }
        setError(
          "Invalid link or you do not have permission to view this file."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFile();
    }
  }, [token, router]);

  const handleDownload = () => {
    if (!file) return;
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Alert variant="destructive" className="max-w-md w-full mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go to Dashboard
        </Button>
      </div>
    );
  }

  if (!file) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{file.name}</h1>
            <p className="text-sm text-gray-500">
              Shared File • {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
        </div>

        <div className="p-8 flex items-center justify-center bg-black/5 min-h-[400px]">
          {file.type.startsWith("image/") ? (
            <div className="relative w-full h-full min-h-[400px]">
              <Image
                src={file.url}
                alt={file.name}
                fill
                style={{ objectFit: "contain" }}
                className="rounded-lg"
              />
            </div>
          ) : file.type.startsWith("video/") ? (
            <video
              src={file.url}
              controls
              className="max-w-full max-h-[600px] rounded-lg shadow-md"
            />
          ) : file.type === "application/pdf" ? (
            <iframe
              src={file.url}
              className="w-full h-[600px] rounded-lg border"
            />
          ) : (
            <div className="text-center">
              <p className="text-gray-500 mb-4">
                Preview not available for this file type.
              </p>
              <Button onClick={handleDownload}>Download Code to View</Button>
            </div>
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t">
          <p className="text-xs text-center text-gray-500">
            Shared via Absiduous Media Secure Link
          </p>
        </div>
      </div>
    </div>
  );
}
