import { ChevronLeft } from 'lucide-react';
import DaftarArtikel from "@/components/article/DaftarArtikel";

export default function Articles() {

    return (
    <div className="w-full">
        <a
            href="/community"
            className="flex items-center text-sm text-blue-600 hover:underline mb-3"
            >
            <ChevronLeft size={16} className="mr-1" />
            Kembali
        </a>
        <DaftarArtikel />
    </div>
  );
}