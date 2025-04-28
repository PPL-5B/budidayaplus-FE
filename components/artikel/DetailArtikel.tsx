interface DetailArtikelProps {
    article: {
      title: string;
      author: string;
      date: string;
      synopsis: string;
      categories: string[];
      reference?: string; 
    };
  }
  
  const DetailArtikel = ({ article }: DetailArtikelProps) => {
    const wordCount = article.synopsis.split(" ").length;
    const readingTime = Math.ceil(wordCount / 200); 
  
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
  
        <div className="text-sm text-gray-600 mt-2 mb-4">
          <p>Oleh: {article.author}</p>
          <p>{article.date} ● {readingTime} menit untuk membaca</p>
        </div>
  
        <div className="flex flex-wrap gap-2 mb-4">
          {article.categories.map((cat) => (
            <span
              key={cat}
              className={`text-white text-xs px-2 py-1 rounded ${
                {
                  "Kisah Inspiratif": "bg-green-600",
                  "Teknik Budidaya": "bg-amber-600",
                  "Nutrisi Pakan": "bg-red-800",
                }[cat] ?? "bg-gray-500"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
  
        <p className="text-gray-800">{article.synopsis}</p>
        <p className="text-sm text-gray-500 mt-4">
          <strong>Referensi:</strong> {article.reference}
        </p>  
      </div>
    );
  };
  
  export default DetailArtikel;
  