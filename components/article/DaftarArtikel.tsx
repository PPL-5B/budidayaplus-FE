import CardArticle from "@/components/ui/card-article";
import { articles } from "@/lib/article/data";

export default function DaftarArtikel() {
  return (
    <section className="space-y-6 p-4">
      <div className="flex justify-center mt-1">
        <h1 className="text-[#2154C5] text-[24px] font-bold">Daftar Artikel</h1>
      </div>

      {articles.map((article) => (
        <CardArticle key={article.id} {...article} />
      ))}
    </section>
  );

}

