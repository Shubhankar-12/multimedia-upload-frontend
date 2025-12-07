"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shareFile, generateLink } from "@/lib/api";
import { Copy, Check, Share2, Link as LinkIcon, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileId: string;
  fileName: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  fileId,
  fileName,
}: ShareDialogProps) {
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [activeTab, setActiveTab] = useState("invite");

  // Step 3 Requirement: Call generateLink immediately when "Copy Link" tab is opened
  useEffect(() => {
    if (activeTab === "link" && isOpen && !generatedLink) {
      handleGenerateLink();
    }
  }, [activeTab, isOpen, generatedLink]);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSharing(true);
    setError("");
    setSuccessMessage("");

    try {
      await shareFile(fileId, email);
      setSuccessMessage(`Successfully shared with ${email}`);
      setEmail("");
    } catch (err) {
      setError("Failed to share file. Please try again.");
    } finally {
      setSharing(false);
    }
  };

  const handleGenerateLink = async () => {
    setGeneratingLink(true);
    setError("");

    try {
      const { url } = await generateLink(fileId);
      setGeneratedLink(url);
    } catch (err) {
      // Only show error if we are on the link tab
      if (activeTab === "link") {
        setError("Failed to generate link.");
      }
    } finally {
      setGeneratingLink(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError("");
    setSuccessMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share "{fileName}"</DialogTitle>
          <DialogDescription>
            Invite others or create a public link.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="mb-4 text-green-600 border-green-200 bg-green-50">
            <Check className="h-4 w-4" />
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Invite User</TabsTrigger>
            <TabsTrigger value="link">Copy Link</TabsTrigger>
          </TabsList>

          <TabsContent value="invite" className="pt-4 space-y-4">
            <form onSubmit={handleShare} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={sharing}>
                {sharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invite...
                  </>
                ) : (
                  "Send Invite"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="link" className="pt-4 space-y-4">
            <div className="space-y-2">
              <Label>Public Link</Label>
              <div className="flex items-center gap-2">
                {generatingLink ? (
                  <div className="flex items-center justify-center w-full h-10 border rounded-md bg-muted/50 text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating
                    Link...
                  </div>
                ) : (
                  <>
                    <Input
                      value={generatedLink || "Error generating link"}
                      readOnly
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={copyToClipboard}
                      disabled={!generatedLink}
                      className={
                        copied ? "text-green-600 border-green-600" : ""
                      }
                    >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone with this link can view the file.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
