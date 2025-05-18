import { useRouter } from "next/router";
import { articles } from "@/lib/article/data";
import DetailArtikel from "@/components/article/DetailArtikel";

export default function ArticleDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Find the article by ID
  const article = articles.find((article) => article.id === id);

  if (!article) {
    return <p className="text-center text-red-600">Artikel tidak ditemukan.</p>;
  }

  return <DetailArtikel article={article} />;
}