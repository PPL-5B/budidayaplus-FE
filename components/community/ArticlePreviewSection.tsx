import Link from 'next/link';
import CardArticle from '@/components/ui/card-article';

const PreviewArticle = ({ articles }: { articles: any[] }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Artikel</h2>
      {articles.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {articles.slice(0, 2).map((article) => (
            <CardArticle key={article.id} {...article} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Maaf, belum ada artikel tersedia.</p>
      )}
      <Link href="/article">
        <button className="bg-blue-500 hover:bg-blue-600 text-white mt-4 px-4 py-2 rounded transition-colors duration-300">
          Lihat Semua Artikel
        </button>
      </Link>
    </div>
  );
};

export default PreviewArticle;