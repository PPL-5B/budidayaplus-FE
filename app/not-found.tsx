import Image from "next/image";




export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50 text-[#4D4C4C]">
      <Image
        src="https://www.svgrepo.com/show/6099/broken-phone-in-two-parts.svg"
        alt="HP Rusak"
        width={120}
        height={120}
        className="mb-6"
      />




      <h1 className="text-xl font-semibold mb-2">Halaman Tidak Ditemukan!</h1>
      <p className="mb-6 max-w-md">
        Mohon maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </p>




      <a
        href="/"
        className="bg-[#2254C5] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#1a42a1] transition"
      >
        ◂ Kembali ke Beranda
      </a>
    </div>
  );
}



