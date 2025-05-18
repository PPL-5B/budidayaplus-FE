// components/cycle/AddCycle.tsx
import { fetchPonds } from '@/lib/pond'
import React from 'react'
import { AddCycleModal } from '@/components/cycle'
import { Profile } from '@/types/profile'

interface AddCycleProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: Profile
}

interface AddCycleContentProps extends AddCycleProps {
  pondList: any[]
}

export const AddCycleContent: React.FC<AddCycleContentProps> = ({ user, pondList, ...props }) => {
  return (
    <div {...props}>
      {user && user.role === 'supervisor' && (
        <AddCycleModal pondList={pondList} />
      )}
    </div>
  )
}

const AddCycle = async ({ user, ...props }: AddCycleProps) => {
  const pondList = await fetchPonds()
  return <AddCycleContent user={user} pondList={pondList} {...props} />}

export default AddCycle
