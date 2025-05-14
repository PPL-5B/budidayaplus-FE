'use client';

import { useEffect, useState } from 'react';
import { handleVote, cancelVote, getVoteSummary } from '@/lib/forum/vote';

export function useForumVote(forumId: string) {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const summary = await getVoteSummary(forumId);
        setLikeCount(summary.upvotes);
        setDislikeCount(summary.downvotes);
        setUserVote(summary.user_vote);
      } catch (err) {
        console.error('Gagal ambil vote:', err);
      }
    };
    fetch();
  }, [forumId]);

  const vote = async (type: 'up' | 'down') => {
    if (userVote === type) {
      await cancelVote(forumId);
      setUserVote(null);
    } else {
      await handleVote(forumId, type);
      setUserVote(type);
    }

    const summary = await getVoteSummary(forumId);
    setLikeCount(summary.upvotes);
    setDislikeCount(summary.downvotes);
    setUserVote(summary.user_vote);
  };

  return {
    likeCount,
    dislikeCount,
    userVote,
    vote,
  };
}
