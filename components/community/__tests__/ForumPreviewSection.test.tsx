import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreviewForum from '../ForumPreviewSection';

// Mock komponen yang diimpor
jest.mock('@/components/forum/ForumCard', () => {
  return function MockForumCard({ forum }: { forum: any }) {
    return <div data-testid="forum-card">{forum.title}</div>;
  };
});

jest.mock('@/components/forum/SeePage', () => {
  return function MockSeePage() {
    return <div data-testid="see-page">Lihat Semua Forum</div>;
  };
});

describe('PreviewForum Component', () => {
  const mockForums = [
    {
      id: '1',
      title: 'Forum Pertama',
      author: 'Penanya 1',
      date: '10 Mei 2023',
      content: 'Pertanyaan forum pertama',
      replies: 5
    },
    {
      id: '2',
      title: 'Forum Kedua',
      author: 'Penanya 2',
      date: '15 Mei 2023',
      content: 'Pertanyaan forum kedua',
      replies: 3
    },
    {
      id: '3',
      title: 'Forum Ketiga',
      author: 'Penanya 3',
      date: '20 Mei 2023',
      content: 'Pertanyaan forum ketiga',
      replies: 0
    }
  ];

  test('renders heading correctly', () => {
    render(<PreviewForum forums={mockForums} />);
    expect(screen.getByText('Forum')).toBeInTheDocument();
  });

  test('renders forums list with maximum 2 forums when forums are available', () => {
    render(<PreviewForum forums={mockForums} />);
    
    // Hanya dua forum pertama yang seharusnya ditampilkan
    expect(screen.getByText('Forum Pertama')).toBeInTheDocument();
    expect(screen.getByText('Forum Kedua')).toBeInTheDocument();
    expect(screen.queryByText('Forum Ketiga')).not.toBeInTheDocument();
  });

  test('renders empty state message when no forums are available', () => {
    render(<PreviewForum forums={[]} />);
    
    // Verifikasi pesan empty state ditampilkan
    expect(screen.getByText('Maaf, belum ada forum tersedia.')).toBeInTheDocument();
    
    // Verifikasi tidak ada ForumCard yang dirender
    expect(screen.queryByTestId('forum-card')).not.toBeInTheDocument();
    
    // SeePage component tetap dirender meskipun tidak ada forum
    expect(screen.getByTestId('see-page')).toBeInTheDocument();
  });

  test('renders ForumCard components for each forum', () => {
    render(<PreviewForum forums={mockForums} />);
    const forumCards = screen.getAllByTestId('forum-card');
    expect(forumCards).toHaveLength(2); // Hanya 2 karena .slice(0, 2)
  });
  
  test('renders correctly with exactly one forum', () => {
    const singleForum = [mockForums[0]];
    render(<PreviewForum forums={singleForum} />);
    
    // Memastikan hanya satu forum yang ditampilkan
    expect(screen.getByText('Forum Pertama')).toBeInTheDocument();
    expect(screen.queryByText('Forum Kedua')).not.toBeInTheDocument();
    
    // SeePage component tetap dirender
    expect(screen.getByTestId('see-page')).toBeInTheDocument();
  });

  test('renders SeePage component', () => {
    render(<PreviewForum forums={mockForums} />);
    expect(screen.getByTestId('see-page')).toBeInTheDocument();
  });
});