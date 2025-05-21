import { ChevronLeft } from 'lucide-react';
import DaftarArtikel from "@/components/article/DaftarArtikel";

export default function Articles() {

    return (
    <div className="w-full">
        <a
            href="/community"
            className="flex items-center text-sm text-blue-600 hover:underline mt-6 mb-3 ml-4"
        >
            <ChevronLeft size={20} />
            Kembali
        </a>
        <DaftarArtikel />
    </div>
  );
}
