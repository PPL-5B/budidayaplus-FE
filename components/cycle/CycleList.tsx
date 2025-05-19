import React from 'react'
import { getCycleList } from '@/lib/cycle' // Ambil data daftar siklus dari server/backend
import { CycleCarousel } from '@/components/cycle' // Komponen untuk menampilkan carousel daftar siklus
import { Profile } from '@/types/profile' // Tipe data untuk user profile

// Tipe props yang diterima komponen, termasuk user
interface CycleListProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: Profile
}

// Komponen CycleList adalah komponen async (Server Component)
const CycleList: React.FC<CycleListProps> = async ({ user, ...props }) => {
  // Ambil data semua siklus (active, past, etc)
  const cycleList = await getCycleList()

  return (
    // Render container div dengan semua props tambahan (misal: className, style)
    <div {...props}>
      {/* Render carousel siklus, passing user dan data siklus */}
      <CycleCarousel user={user} cycleList={cycleList} />
    </div>
  )
}

export default CycleList
