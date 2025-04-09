import React, { useState } from "react";
import DeleteForumModal from "./DeleteForumModal";
import { deleteForumById } from "@/lib/forum/delete";

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
  const token = localStorage.getItem("accessToken") ?? "";

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteForumById(forumId, token);
      onSuccess(); // trigger hapus di tampilan
    } catch (error) {
      console.error("Error:", error);
  
      // tetap hapus secara visual meskipun 404
      onSuccess(); 
    } finally {
      setLoading(false);
      onClose();
    }
  };
  
  

  if (!isOpen) return null;

  return (
    <DeleteForumModal
      forumTitle={forumTitle}
      onDelete={handleDelete}
      onClose={onClose}
      loading={loading} // 
    />
  );
};

export default DeleteForumContainer;
