import ForumCard from '@/components/forum/ForumCard';
import SeePage from "@/components/forum/SeePage";

const PreviewForum = ({ forums }: { forums: any[] }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Forum</h2>
      {forums.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {forums.slice(0, 2).map((forum) => (
            <ForumCard key={forum.id} forum={forum} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">Maaf, belum ada forum tersedia.</p>
      )}

      <div className="mt-4">
        <SeePage />
      </div>

    </div>
  );
};

export default PreviewForum;