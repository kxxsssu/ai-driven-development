"use client";

import { useState, FormEvent } from "react";
import { Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useInteractionStore } from "@/store/interaction-store";

import type { IComment } from "@/types/feed";

interface ICommentDialogProps {
  imageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MAX_COMMENT_LENGTH = 300;
// 셀렉터에서 매번 새 배열([])을 만들면 참조가 바뀌어 무한 리렌더가 발생한다.
// 안정적인 동일 참조를 반환하기 위한 공유 상수.
const EMPTY_COMMENTS: IComment[] = [];

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
}

export function CommentDialog({
  imageId,
  open,
  onOpenChange,
}: ICommentDialogProps) {
  const comments = useInteractionStore(
    (state) => state.comments[imageId] ?? EMPTY_COMMENTS
  );
  const addComment = useInteractionStore((state) => state.addComment);
  const [text, setText] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addComment(imageId, "나", trimmed);
    setText("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="text-base">
            댓글 {comments.length > 0 && `(${comments.length})`}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {comments.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              첫 번째 댓글을 남겨보세요.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {comments.map((comment) => (
                <li key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs">
                      {comment.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-foreground/90">
                      {comment.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 border-t border-border px-5 py-4"
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="댓글을 입력하세요..."
            rows={1}
            className="max-h-28 min-h-[40px] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            aria-label="댓글 입력"
          />
          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 shrink-0"
            disabled={!text.trim()}
            aria-label="댓글 등록"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
