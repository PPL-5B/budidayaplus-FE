export async function updateForum(id: string, formData: FormData) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forum/update/${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include', // <<< INI WAJIB BANGET
    });

    if (!res.ok) {
      const err = await res.json();
      return { success: false, message: err.message || 'Gagal update forum' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: 'Terjadi kesalahan saat update forum' };
  }
}