import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DaftarArtikel from '../DaftarArtikel';

// Mock artikel data - kita akan mengganti ini untuk test yang berbeda
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

jest.mock('@/lib/article/data', () => ({
  articles: []
}));

// Mock CardArticle component
jest.mock('@/components/ui/card-article', () => {
  return function MockCardArticle(props: any) {
    return (
      <div data-testid="card-article">
        <h3>{props.title}</h3>
        <p>{props.author}</p>
      </div>
    );
  };
});

describe('DaftarArtikel Component', () => {
  beforeEach(() => {
    // Reset mock untuk setiap test
    jest.resetModules();
  });

  test('renders heading correctly when no articles available', () => {
    // Mock dengan array kosong (default dari setup di awal)
    render(<DaftarArtikel />);
    
    // Verifikasi heading ditampilkan
    expect(screen.getByText('Daftar Artikel')).toBeInTheDocument();
    
    // Verifikasi tidak ada CardArticle yang dirender
    expect(screen.queryByTestId('card-article')).not.toBeInTheDocument();
  });

  test('renders all articles from the data source', () => {
    // Override mock untuk test ini dengan data artikel
    jest.mock('@/lib/article/data', () => ({
      articles: mockArticles
    }), {virtual: true});
    
    // Re-import component dengan mock baru
    const { default: RefreshedDaftarArtikel } = require('../DaftarArtikel');
    
    render(<RefreshedDaftarArtikel />);
    
    // Verifikasi bahwa CardArticle dirender untuk setiap artikel
    const cardArticles = screen.getAllByTestId('card-article');
    expect(cardArticles).toHaveLength(3); // 3 artikel dari mock data
    
    // Verifikasi judul artikel dirender
    expect(screen.getByText('Artikel Pertama')).toBeInTheDocument();
    expect(screen.getByText('Artikel Kedua')).toBeInTheDocument();
    expect(screen.getByText('Artikel Ketiga')).toBeInTheDocument();
    
    // Verifikasi penulis artikel dirender
    expect(screen.getByText('Penulis 1')).toBeInTheDocument();
    expect(screen.getByText('Penulis 2')).toBeInTheDocument();
    expect(screen.getByText('Penulis 3')).toBeInTheDocument();
  });
  
  test('renders correctly with exactly one article', () => {
    // Override mock untuk test ini dengan satu artikel saja
    jest.mock('@/lib/article/data', () => ({
      articles: [mockArticles[0]]
    }), {virtual: true});
    
    // Re-import component dengan mock baru
    const { default: RefreshedDaftarArtikel } = require('../DaftarArtikel');
    
    render(<RefreshedDaftarArtikel />);
    
    // Verifikasi heading ditampilkan
    expect(screen.getByText('Daftar Artikel')).toBeInTheDocument();
    
    // Memastikan hanya satu artikel yang ditampilkan
    expect(screen.getByText('Artikel Pertama')).toBeInTheDocument();
    expect(screen.queryByText('Artikel Kedua')).not.toBeInTheDocument();
    expect(screen.queryByText('Artikel Ketiga')).not.toBeInTheDocument();
    
    // Verifikasi penulis artikel dirender
    expect(screen.getByText('Penulis 1')).toBeInTheDocument();
    expect(screen.queryByText('Penulis 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Penulis 3')).not.toBeInTheDocument();
  });
});