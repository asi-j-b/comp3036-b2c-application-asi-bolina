import Link from "next/link";

export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  return (
    <li className="list-none"> {}
      <Link 
        href={link} 
        title={title}
        className={`
          inline-flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition
          ${isSelected 
            ? "selected bg-white text-primary shadow-sm"
            : "text-primary hover:bg-white/70"
          }
        `}
      >
        {count > 0 && (
          <span 
            data-test-id="post-count"
            className={`
              flex h-5 min-w-[1.25rem] items-center justify-center rounded-md border border-gray-200 bg-[var(--surface)] px-1.5 text-[10px] text-secondary
            `}
          >
            {count}
          </span>
        )}

        <span className="truncate">{name}</span>
      </Link>
    </li>
  );
}