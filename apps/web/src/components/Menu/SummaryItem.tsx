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
      <Link href={link}>
        <span>
          {name}
        </span>
        
        {count > 0 && <span> ({count}) </span>}
      </Link>
    </li>
  );
}
