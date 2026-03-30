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
    <li>
      <Link href={link} title={title}> 
        <span>{isSelected ? <strong>{name}</strong> : name}</span>
        {count > 0 && (
          <span data-test-id="post-count">{count}</span>
        )}
      </Link>
    </li>
  );
}
