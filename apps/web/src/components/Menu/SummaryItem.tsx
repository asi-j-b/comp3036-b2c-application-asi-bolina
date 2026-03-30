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
    <li className="inline-block"> {}
      <Link 
        href={link} 
        title={title}
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
          ${isSelected 
            ? "bg-wsu text-white shadow-md scale-105" // High contrast for selected tag
            : "bg-gray-100 text-primary hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          }
          mr-2 mb-2 border border-transparent
        `}
      >
        <span>
           {/* Add a hashtag for that "tag" feel */}
          <span className="opacity-50 mr-0.5">#</span>
          {name}
        </span>

        {count > 0 && (
          <span 
            data-test-id="post-count"
            className={`
              flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] 
              ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 dark:bg-gray-700 text-secondary"}
            `}
          >
            {count}
          </span>
        )}
      </Link>
    </li>
  );
}