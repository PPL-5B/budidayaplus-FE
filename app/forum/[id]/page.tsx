'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DetailForum from '@/components/forum/DetailForum';
import AddReply from '@/components/forum/AddReply';
import { getReplies } from '@/lib/forum/getReplies';

interface ForumDetail {
  id: string;
  description: string;
  timestamp: string;
  user: {
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

interface Reply {
  id: string;
  description: string;
  timestamp: string;
  user: {
    first_name: string;
    last_name: string;
    phone_number: string;
  };
}

const ForumDetailPage = () => {
  const [forum, setForum] = useState<ForumDetail | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [refreshReplies, setRefreshReplies] = useState(0);
  const router = useRouter();
  const params = useParams();

  const forumId = params?.id || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('selectedForum') ?? '{}').id : null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedForum = localStorage.getItem('selectedForum');
      if (storedForum) {
        setForum(JSON.parse(storedForum));
      } else {
        router.push('/forum');
      }
    }
  }, [router]);

  useEffect(() => {
    if (forumId) {
      getReplies(forumId).then(data =>
        setReplies(
          data.map(reply => ({
            id: reply.id,
            description: reply.description,
            timestamp: typeof reply.timestamp === 'string' ? reply.timestamp : new Date(reply.timestamp).toISOString(),
            user: {
              first_name: reply.user.first_name,
              last_name: reply.user.last_name,
              phone_number: reply.user.phone_number,
            },
          }))
        )
      );
    }
  }, [forumId, refreshReplies]);

  if (!forum) {
    return <div className="p-4">Memuat data forum...</div>;
  }

  return (
    <div className="min-h-screen bg-[#EAF0FF] py-6">
      <DetailForum forum={forum} />
      <div className="max-w-2xl mx-auto mt-8 px-6">
        <AddReply
          parentForumId={forum.id}
          onReplyAdded={() => setRefreshReplies((r) => r + 1)}
        />
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Replies</h2>
          {replies.length === 0 ? (
            <p className="text-gray-500">No replies yet.</p>
          ) : (
            <ul className="space-y-6 pb-28"> {/* Tambahkan padding bottom besar di sini */}
              {replies.map((reply) => (
                <li
                  key={reply.id}
                  className="bg-white border border-blue-500 rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {reply.user.first_name} {reply.user.last_name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {reply.user.phone_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-bold">
                      {reply.user.first_name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Tanggal Pembuatan:</span> {new Date(reply.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Jam Pembuatan:</span> {new Date(reply.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-700 mt-3">
                    <span className="font-semibold">Deskripsi Reply:</span><br />
                    {reply.description}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumDetailPage;