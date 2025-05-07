import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreviewArticle from '../ArticlePreviewSection';

// Mock next/link karena kita tidak ingin menavigasi dalam test
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

describe('PreviewArticle Component', () => {
  const mockArticles = [
    {
      id: '1',
      title: 'Artikel Pertama',
      author: 'Penulis 1',
      date: '10 Mei 2023',
      synopsis: 'Ini adalah artikel pertama',
      categories: ['Kisah Inspiratif']
    },
    {
      id: '2',
      title: 'Artikel Kedua',
      author: 'Penulis 2',
      date: '15 Mei 2023',
      synopsis: 'Ini adalah artikel kedua',
      categories: ['Teknik Budidaya']
    },
    {
      id: '3',
      title: 'Artikel Ketiga',
      author: 'Penulis 3',
      date: '20 Mei 2023',
      synopsis: 'Ini adalah artikel ketiga',
      categories: ['Nutrisi Pakan']
    }
  ];

  test('renders heading correctly', () => {
    render(<PreviewArticle articles={mockArticles} />);
    expect(screen.getByText('Artikel')).toBeInTheDocument();
  });

  test('renders articles list with maximum 2 articles when articles are available', () => {
    render(<PreviewArticle articles={mockArticles} />);
    
    // Hanya dua artikel pertama yang seharusnya ditampilkan
    expect(screen.getByText('Artikel Pertama')).toBeInTheDocument();
    expect(screen.getByText('Artikel Kedua')).toBeInTheDocument();
    expect(screen.queryByText('Artikel Ketiga')).not.toBeInTheDocument();
  });

  test('renders empty state message when no articles are available', () => {
    render(<PreviewArticle articles={[]} />);
    
    // Verifikasi pesan empty state ditampilkan
    expect(screen.getByText('Maaf, belum ada artikel tersedia.')).toBeInTheDocument();
    
    // Verifikasi tidak ada CardArticle yang dirender
    expect(screen.queryByTestId('card-article')).not.toBeInTheDocument();
    
    // Tetap menampilkan tombol "Lihat Semua Artikel" meskipun tidak ada artikel
    expect(screen.getByText('Lihat Semua Artikel')).toBeInTheDocument();
  });

  test('renders "Lihat Semua Artikel" button', () => {
    render(<PreviewArticle articles={mockArticles} />);
    expect(screen.getByText('Lihat Semua Artikel')).toBeInTheDocument();
  });

  // Ini mengasumsikan CardArticle akan merender data artikel yang diteruskan sebagai props
  test('passes article data to CardArticle components', () => {
    render(<PreviewArticle articles={mockArticles} />);
    
    // Jika CardArticle dirender dengan benar, kita akan melihat judul artikel
    expect(screen.getByText('Artikel Pertama')).toBeInTheDocument();
    expect(screen.getByText('Artikel Kedua')).toBeInTheDocument();
  });
  
  test('renders correctly with exactly one article', () => {
    const singleArticle = [mockArticles[0]];
    render(<PreviewArticle articles={singleArticle} />);
    
    // Memastikan hanya satu artikel yang ditampilkan
    expect(screen.getByText('Artikel Pertama')).toBeInTheDocument();
    expect(screen.queryByText('Artikel Kedua')).not.toBeInTheDocument();
    
    // Tombol "Lihat Semua Artikel" tetap ditampilkan
    expect(screen.getByText('Lihat Semua Artikel')).toBeInTheDocument();
  });
});