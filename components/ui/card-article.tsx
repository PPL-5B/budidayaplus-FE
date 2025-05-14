
import Link from "next/link";

interface CardArticleProps {
  id: string;
  title: string;
  author: string;
  date: string;
  synopsis: string;
  categories: string[];
}

const categoryColorMap: Record<string, string> = {
  "Kisah Inspiratif": "bg-green-600",
  "Teknik Budidaya": "bg-amber-600",
  "Nutrisi Pakan": "bg-red-800",
};

export default function CardArticle({ id, title, author, date, synopsis, categories }: CardArticleProps) {
  return (
    <div className="border rounded-lg p-4 space-y-3 shadow bg-white">
      <h2 className="text-blue-700 font-bold text-lg hover:underline">
        <Link href={`/artikel/${id}`}>{title}</Link>
      </h2>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat, i) => (
          <span
            key={i}
            className={`text-white text-xs px-2 py-1 rounded ${categoryColorMap[cat] ?? 'bg-gray-500'}`}
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-700">
        {author} ● {date}
      </div>

      <p className="text-sm text-gray-600">{synopsis}</p>

      <Link
        href={`/artikel/${id}`}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold"
      >
        Baca Selengkapnya ▸
      </Link>
    </div>
  );
}

