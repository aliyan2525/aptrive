"use client";

import { useState, useTransition } from "react";
import { toggleBookmarkAction } from "@/app/practice/actions";

type Props = {
  questionId: string;
  initialBookmarked: boolean;
  onToggled?: (nowBookmarked: boolean) => void;
};

export default function BookmarkButton({
  questionId,
  initialBookmarked,
  onToggled,
}: Props) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (pending) return;
    const optimistic = !bookmarked;
    setBookmarked(optimistic);

    startTransition(async () => {
      try {
        const result = await toggleBookmarkAction(questionId);
        setBookmarked(result);
        onToggled?.(result);
      } catch {
        setBookmarked(!optimistic);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this question"}
      className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        bookmarked
          ? "border-gold bg-gold-dim text-gold"
          : "border-line text-muted hover:border-line-strong hover:text-fg"
      }`}
    >
      {bookmarked ? "★ Saved" : "☆ Save"}
    </button>
  );
}
