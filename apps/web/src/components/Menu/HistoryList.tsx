"use client";

import { history } from "@/functions/history";
import { type Post } from "@repo/db/data";
import { SummaryItem } from "./SummaryItem";
import { LinkList } from "./LinkList";
import { useState, useEffect } from "react";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: Post[];
}) {
  const [data, setData] = useState<{ month: number; year: number; count: number }[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      const result = await history(posts);
      setData(result);
    };

    loadHistory();
  }, [posts]);

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component
  return <div>History List</div>;
}
