import { Suspense } from 'react';
import ForumPage from './ForumClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading forum...</div>}>
      <ForumPage />
    </Suspense>
  );
}
