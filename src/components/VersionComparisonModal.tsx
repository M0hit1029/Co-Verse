"use client";

import React from "react";
import * as Y from "yjs";
import { Change, diffWords } from "diff";
import { yDocToProsemirrorJSON } from "y-prosemirror";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

type DocumentVersion = {
  id: string;
  createdAt: string;
  content: Uint8Array;
};

interface VersionComparisonProps {
  currentVersion: DocumentVersion;
  previousVersion: DocumentVersion;
}

const VersionComparison: React.FC<VersionComparisonProps> = ({
  currentVersion,
  previousVersion,
}) => {
  // ✅ Convert Y.js document snapshot to plain text
  const extractTextFromVersion = (version: DocumentVersion): string => {
    try {
      const tempDoc = new Y.Doc();
      Y.applyUpdate(tempDoc, version.content);
      const contentJSON = yDocToProsemirrorJSON(tempDoc, "content");
      tempDoc.destroy();

      // Recursive Node type
      type Node = {
        type?: string;
        text?: string;
        content?: Node[];
      };

      // Recursive function to extract text from nodes
      const extractText = (node: Node): string => {
        if (node.type === "text" && node.text) {
          return node.text;
        }
        if (node.content && Array.isArray(node.content)) {
          return node.content.map((child) => extractText(child)).join("");
        }
        return "";
      };

      return extractText(contentJSON as Node);
    } catch (error) {
      console.error("Error extracting text:", error);
      return "";
    }
  };

  const currentText = extractTextFromVersion(currentVersion);
  const previousText = extractTextFromVersion(previousVersion);

  // ✅ Calculate text diff
  const differences: Change[] = diffWords(previousText, currentText);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 border border-gray-700 bg-black text-gray-100">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 text-green-400">
          Document Version Comparison
        </h2>

        <ScrollArea className="h-[400px] w-full rounded-md border border-gray-800 p-4 bg-gray-900">
          <motion.div
            className="leading-relaxed text-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {differences.map((part, index) => (
              <span
                key={index}
                className={
                  part.added
                    ? "bg-green-700/50 text-green-300 px-1 rounded"
                    : part.removed
                    ? "bg-red-700/50 text-red-300 px-1 rounded line-through"
                    : "text-gray-200"
                }
              >
                {part.value}
              </span>
            ))}
          </motion.div>
        </ScrollArea>

        <div className="mt-4 text-sm text-gray-400">
          <p>
            <strong>Previous Version:</strong> {previousVersion.createdAt}
          </p>
          <p>
            <strong>Current Version:</strong> {currentVersion.createdAt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VersionComparison;
