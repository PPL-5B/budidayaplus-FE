import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PreviewForum from '@/components/community/ForumPreviewSection';
import PreviewArticle from '@/components/community/ArticlePreviewSection';
import { getListForum } from '@/lib/forum/getListForum';
import { articles } from '@/lib/article/data';

const CommunityPage = async () => {
  const forums = await getListForum();

  return (
    <div className="p-6 space-y-4">
      {/* Tombol kembali */}
      <div className="mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline transition ml-1"
        >
          <ChevronLeft size={18} />
          Kembali
        </Link>
      </div>
      {/* Heading dan deskripsi */}
      <div className="text-center">
        <h1 className="text-[#2154C5] text-[30px] font-bold">Komunitas</h1>
        <div className="bg-white rounded-md mt-4 inline-block px-6 py-4 shadow-sm max-w-md">
          <p className="text-[#2154C5] text-[14px] font-semibold">
            Selamat datang di halaman komunitas! <br />
            Temukan forum dan artikel menarik di sini.
          </p>
        </div>
      </div>

      {/* Forum & Artikel */}
      <section>
        <PreviewForum forums={forums} />
      </section>

      <hr className="border-t border-gray-300" />

      <section>
        <PreviewArticle articles={articles} />
      </section>
    </div>
  );
};

export default CommunityPage;
