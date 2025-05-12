import PreviewForum from '@/components/community/ForumPreviewSection';
import PreviewArticle from '@/components/community/ArticlePreviewSection'; // Pastikan path-nya benar
import { getListForum } from '@/lib/forum/getListForum';
import { articles } from '@/lib/article/data';

const CommunityPage = async () => {
  const forums = await getListForum();

  return (
    <div className="p-6 space-y-8">
        <div>
            <h1 className='text-3xl font-semibold mt-5 mb-3 text-[#2154C5]'>Komunitas</h1>
            <p>Selamat datang di halaman komunitas! Temukan forum dan artikel menarik di sini.</p>
        </div>

        <PreviewForum forums={forums} />
        <PreviewArticle articles={articles} />
    </div>
  );
};

export default CommunityPage;
