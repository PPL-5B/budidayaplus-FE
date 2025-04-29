import React, { useState } from "react";
import DeleteForumModal from "./DeleteForumModal";
import { deleteForumById } from "@/lib/forum/delete";

interface DeleteForumContainerProps {
  forumId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteForumContainer: React.FC<DeleteForumContainerProps> = ({
  forumId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteForumById(forumId);
      onSuccess(); // trigger hapus di tampilan
    } catch (error) {
      console.error("Error:", error);
      onSuccess(); // tetap hapus visual walaupun gagal
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <DeleteForumModal
      onDelete={handleDelete}
      onClose={onClose}
      loading={loading}
    />
  );
};

export default DeleteForumContainer;
