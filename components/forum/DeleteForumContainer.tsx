import React, { useState } from "react";
import DeleteForumModal from "./DeleteForumModal";
import { deleteForumById } from "@/lib/forum/deleteForumById";

interface DeleteForumContainerProps {
  forumId: string;
  forumTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteForumContainer: React.FC<DeleteForumContainerProps> = ({
  forumId,
  forumTitle,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteForumById(forumId);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <DeleteForumModal
      forumTitle={forumTitle}
      onDelete={handleDelete}
      onClose={onClose}
    />
  );
};

export default DeleteForumContainer;
