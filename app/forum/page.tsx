import React from 'react';
import ForumList from '@/components/forum/ForumList';

const ForumPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8">
        <h1 className='text-3xl leading-7 mb-5 mt-5 font-semibold text-[#2154C5]'>Daftar Forum</h1>
        <ForumList />
    </div>
  );
};

export default ForumPage;