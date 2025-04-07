import React, { useState } from "react";
import DeleteForumModal from "./DeleteForumModal";

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

      const response = await fetch(`/api/forum/delete/${forumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error("Gagal menghapus forum");
      }
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
