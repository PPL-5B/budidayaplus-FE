import { useState, useEffect } from "react";
import { upvoteForum, downvoteForum, cancelVote, fetchVoteSummary, fetchUserVotes } from "@/lib/forum/voteForum";

export const useVote = (forumId: string) => {
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);
  const [userVote, setUserVote] = useState<string | null>(null); // "upvote", "downvote", atau null
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // Tambahkan state ini

  const fetchData = async () => {
    try {
      // Ambil ringkasan vote untuk forum
      const summary = await fetchVoteSummary(forumId);
      setUpvotes(summary.upvotes);
      setDownvotes(summary.downvotes);

      // Ambil data vote user
      const userVotes = await fetchUserVotes();
      const userVoteForForum = userVotes.votes.find((vote: any) => vote.forum__id === forumId);

      // Terjemahkan "up" menjadi "upvote" dan "down" menjadi "downvote"
      setUserVote(
        userVoteForForum
          ? (() => {
              const voteChoice = userVoteForForum.vote_choice === "up" ? "upvote" : "downvote";
              return voteChoice;
            })()
          : null
      );
    } catch (error) {
      console.error("Error fetching vote data:", error);
    } finally {
      setIsInitialized(true); // Tandai bahwa data sudah di-fetch
    }
  };

  useEffect(() => {
    fetchData();
  }, [forumId]);

  const handleUpvote = async () => {
    try {
      setIsLoading(true);
      await upvoteForum(forumId);
      await fetchData(); // Ambil ulang data setelah vote
    } catch (error) {
      console.error("Error upvoting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownvote = async () => {
    try {
      setIsLoading(true);
      await downvoteForum(forumId);
      await fetchData(); // Ambil ulang data setelah vote
    } catch (error) {
      console.error("Error downvoting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVote = async () => {
    try {
      setIsLoading(true);
      await cancelVote(forumId);
      await fetchData(); // Ambil ulang data setelah vote dibatalkan
    } catch (error) {
      console.error("Error canceling vote:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    upvotes,
    downvotes,
    userVote,
    isLoading,
    isInitialized, // Return state ini
    handleUpvote,
    handleDownvote,
    handleCancelVote,
  };
};