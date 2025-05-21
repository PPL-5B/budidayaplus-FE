import Link from 'next/link';
import CardArticle from '@/components/ui/card-article';

const PreviewArticle = ({ articles }: { articles: any[] }) => {
  return (
    <div>
      <h2 className="text-[22px] text-[#2154C5] font-bold mb-4">Artikel</h2>
      {articles.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {articles.slice(0, 2).map((article) => (
            <CardArticle key={article.id} {...article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Maaf, belum ada artikel tersedia.</p>
      )}
      <div className="flex justify-center mt-6">
        <Link
          href="/article"
          className="inline-block bg-[#2254C5] hover:bg-[#1e46a1] text-white mt-4 px-4 py-2 rounded transition-colors duration-300 text-sm"
        >
          Lihat Semua Artikel
        </Link>
      </div>
    </div>
  );
};

export default PreviewArticle;