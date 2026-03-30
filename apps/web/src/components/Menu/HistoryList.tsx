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

  return (
    <LinkList title="Archive">
      {data.map((item) => {
        const monthName = months[item.month];
        const label = `${monthName} ${item.year}`;
        const url = `/archive/${item.year}/${item.month}`;
        return (
          <SummaryItem
            key={url}
            name={label}
            count={item.count}
            // Logic to check if this specific month/year is currently selected
            isSelected={
              item.year.toString() === selectedYear && 
              item.month.toString() === selectedMonth
            }
            link={url}
            title={`History / ${label}`}
          />
        );
      })}
    </LinkList>
  );
}
