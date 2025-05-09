import CardArticle from "@/components/ui/card-article";

const articles = [
  {
    id: "1",
    title: "Judul Artikel #1: Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    author: "Novrizal A",
    date: "14 April 2025",
    synopsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    categories: ["Kisah Inspiratif", "Teknik Budidaya"],
  },
  {
    id: "2",
    title: "Judul Artikel #2: Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    author: "Hana",
    date: "15 April 2025",
    synopsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
    categories: ["Nutrisi Pakan"],
  },
  {
    id: "3",
    title: "Judul Artikel #3: Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    author: "Novrizal A",
    date: "16 April 2025",
    synopsis: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...",
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