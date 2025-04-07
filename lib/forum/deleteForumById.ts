export async function deleteForumById(forumId: string) {
    const response = await fetch(`/api/forum/delete/${forumId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) throw new Error("Gagal menghapus forum");
    return response.json();
  }
  