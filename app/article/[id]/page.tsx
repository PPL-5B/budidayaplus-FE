import { notFound } from "next/navigation";
import Link from "next/link";
import DetailArtikel from "@/components/article/DetailArtikel";
import { articles } from "@/lib/article/data";

interface DetailArtikelPageProps {
  params: { id: string };
}

export default function DetailArtikelPage({ params }: Readonly<DetailArtikelPageProps>) {
  const article = articles.find((a) => a.id === params.id);

  if (!article) {
    notFound();
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/article" className="text-blue-600 flex items-center space-x-2 mb-4">
        <span>&#8592; Kembali</span>
      </Link>

      <DetailArtikel article={article} />
    </div>
  );
}
