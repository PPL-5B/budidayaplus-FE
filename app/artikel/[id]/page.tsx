import { notFound } from "next/navigation";
import Link from "next/link";
import DetailArtikel from "@/components/artikel/DetailArtikel";

interface DetailArtikelPageProps {
 params: { id: string };
}

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

export default function DetailArtikelPage({ params }: DetailArtikelPageProps) {
 const article = articles.find((a) => a.id === params.id);

 if (!article) {
   notFound();
 }

 return (
   <div className="p-6 max-w-3xl mx-auto">
     <Link href="/" className="text-blue-600 flex items-center space-x-2 mb-4">
       <span>&#8592; Kembali</span>
     </Link>

     <DetailArtikel article={article} />
   </div>
 );
}