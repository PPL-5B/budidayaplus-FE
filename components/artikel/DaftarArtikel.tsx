import CardArticle from "../ui/card-article";

const articles = [
  {
    id: "1",
    title: "Judul Artikel #1: Bagaimana Saya Memperoleh Ratusan Juta Rupiah per bulan dari Budidaya Ikan Lele",
    author: "Novrizal A",
    date: "14 April 2025",
    synopsis: "Seorang petambak lele berusia 26 tahun berhasil mendapatkan penghasilan ratusan juta rupiah per bulan dari usaha budidaya ikan lele dengan panen 12 ton per bulan.",
    categories: ["Kisah Inspiratif", "Teknik Budidaya"], //source : https://aceh.tribunnews.com/2023/08/15/kisah-gustavian-usia-26-tahun-sukses-bisnis-budidaya-lele-omzet-capai-rp-500-juta-per-bulan
  },
  {
    id: "2",
    title: "Judul Artikel #2: Cara Membuat Pakan Ikan Lele dengan Kualitas Tinggi",
    author: "Hana",
    date: "15 April 2025",
    synopsis: "Untuk mempercepat pertumbuhan ikan lele, penting memahami kebutuhan nutrisi pada pakan lele berdasarkan tahap pertumbuhan. Bagaimanakah cara membuat pakan ikan lele yang berkualitas tinggi?",
    categories: ["Nutrisi Pakan"], // source : https://www.minapoli.com/info/pakan-ikan-lele-cepat-besar-jenis-kebutuhan-nutrisi-dan-cara-pembuatan
  },
  {
    id: "3",
    title: "Judul Artikel #3: Panduan Singkat Budidaya Ikan Lele untuk Pemula",
    author: "Novrizal A",
    date: "16 April 2025",
    synopsis: "Budidaya ikan lele memiliki potensi pasar yang menjanjikan dengan produksi mencapai 1,06 juta ton senilai Rp18,93 triliun pada 2022. Bagaimanakah cara membudidayakan ikan lele untuk pemula untuk meraup untung yang maksimal?",
    categories: ["Teknik Budidaya"], // source : https://www.pasarmikro.id/buletin/panduan-budidaya-ikan-lele-untuk-pemula/
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