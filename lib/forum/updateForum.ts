import Cookies from 'js-cookie';

interface UpdateForumResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export async function updateForum(
  id: string,
  title: string, 
  description: string
): Promise<UpdateForumResponse> {
  const token = Cookies.get('accessToken');
  if (!token) {
    return { success: false, message: 'Token tidak ditemukan' };
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forum/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return { 
        success: false, 
        message: errorData.error || 'Gagal update forum' 
      };
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Update forum error:', error);
    return { 
      success: false, 
      message: 'Terjadi kesalahan saat update forum' 
    };
  }
}