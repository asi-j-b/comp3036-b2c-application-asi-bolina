"use client";

import { useState } from "react";

type LikeButtonProps = {
  postId: number;
  initialLikes: number;
};

export function LikeButton({ postId, initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [buttonLabel, setButtonLabel] = useState("Like");

  async function handleClick() {
    const response = await fetch("/api/likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId }),
    });

    if (!response.ok) {
      return;
    }

    const responseBody = (await response.json()) as {
      likes: number;
      liked: boolean;
    };

    setLikes(responseBody.likes);
    setButtonLabel(responseBody.liked ? "Unlike" : "Like");
  }

  return (
    <div className="flex items-center gap-3">
      <p>{likes} likes</p>
      <button
        type="button"
        data-test-id="like-button"
        onClick={handleClick}
        className="rounded-xl bg-wsu px-4 py-2 text-sm font-semibold text-white transition hover:bg-wsu-light"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
