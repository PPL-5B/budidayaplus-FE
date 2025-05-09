import CardArticle from "@/components/ui/card-article";
import { articles } from "@/lib/article/data";

export default function DaftarArtikel() {
  return (
    <section className="space-y-6 p-4">
      <h1 className="text-xl font-bold">Daftar Artikel</h1>
      {articles.map((article) => (
        <CardArticle key={article.id} {...article} />
      ))}
    </section>
  );
}