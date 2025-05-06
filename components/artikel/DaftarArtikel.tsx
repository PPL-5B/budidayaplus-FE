import CardArticle from "@/components/ui/card-article";

const articles = [
  {
    id: "1",
    title: "Bagaimana Saya Memperoleh Ratusan Juta Rupiah per bulan dari Budidaya Ikan Lele",
    author: "M. Imam Chaidar",
    date: "14 April 2025",
    synopsis: "Seorang petambak lele berusia 26 tahun berhasil mendapatkan penghasilan ratusan juta rupiah per bulan dari usaha budidaya ikan lele dengan panen 12 ton per bulan.",
    categories: ["Kisah Inspiratif", "Teknik Budidaya"],
  },
  {
    id: "2",
    title: "Cara Membuat Pakan Ikan Lele dengan Kualitas Tinggi",
    author: "M. Imam Chaidar",
    date: "15 April 2025",
    synopsis: "Untuk mempercepat pertumbuhan ikan lele, penting memahami kebutuhan nutrisi pada pakan lele berdasarkan tahap pertumbuhan. Bagaimanakah cara membuat pakan ikan lele yang berkualitas tinggi?",
    categories: ["Nutrisi Pakan"],
  },
  {
    id: "3",
    title: "Panduan Singkat Budidaya Ikan Lele untuk Pemula",
    author: "M. Imam Chaidar",
    date: "16 April 2025",
    synopsis: "Budidaya ikan lele memiliki potensi pasar yang menjanjikan dengan produksi mencapai 1,06 juta ton senilai Rp18,93 triliun pada 2022. Bagaimanakah cara membudidayakan ikan lele untuk pemula untuk meraup untung yang maksimal?",
    categories: ["Teknik Budidaya"],
  },
];

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