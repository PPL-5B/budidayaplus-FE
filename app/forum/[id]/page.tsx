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
          <h2 className="text-lg font-semibold mb-2">Daftar Balasan</h2>
          {replies.length === 0 ? (
            <p className="text-gray-500">Belum ada balasan.</p>
          ) : (
            <ul className="space-y-4 pb-28">
              {replies.map((reply) => (
                <li
                  key={reply.id}
                  className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-sm">
                      {reply.user.first_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {reply.user.first_name} 
                      </span>
                      <span className="text-xs text-gray-500">
                        {reply.user.phone_number}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-3">
                    <span className="font-medium">Deskripsi Balasan:</span><br />
                    <p className="mt-1">{reply.description}</p>
                  </div>
                  
                  <div className="flex justify-between text-xs text-gray-500 border-t pt-2">
                    <span>Dibuat: {new Date(reply.timestamp).toLocaleDateString('id-ID')}</span>
                    <span>{new Date(reply.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
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