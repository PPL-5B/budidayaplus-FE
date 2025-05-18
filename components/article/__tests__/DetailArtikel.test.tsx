import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailArtikel from '../DetailArtikel';

describe('DetailArtikel Component', () => {
  const mockArticle = {
    title: 'Cara Budidaya Ikan Lele',
    author: 'Pak Tani',
    date: '15 Mei 2023',
    synopsis: 'Budidaya ikan lele merupakan salah satu usaha yang menjanjikan. Ikan lele mudah dipelihara dan tidak membutuhkan banyak perawatan khusus. Budidaya ikan lele dapat dilakukan di kolam tanah, terpal, atau beton. Pemilihan bibit unggul sangat penting untuk keberhasilan budidaya. Bibit unggul memiliki pertumbuhan yang cepat dan tahan terhadap penyakit. Pemberian pakan yang tepat juga mempengaruhi pertumbuhan ikan lele.',
    categories: ['Teknik Budidaya', 'Nutrisi Pakan']
  };

  test('renders article title correctly', () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText('Cara Budidaya Ikan Lele')).toBeInTheDocument();
  });

  test('renders author information correctly', () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText('Oleh: Pak Tani')).toBeInTheDocument();
  });

  test('renders date information correctly', () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText(/15 Mei 2023/)).toBeInTheDocument();
  });

  test('renders article synopsis correctly', () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText(/Budidaya ikan lele merupakan salah satu usaha yang menjanjikan/)).toBeInTheDocument();
  });

  test('renders all categories with correct styling', () => {
    render(<DetailArtikel article={mockArticle} />);
    
    const teknikBudidaya = screen.getByText('Teknik Budidaya');
    const nutrisiPakan = screen.getByText('Nutrisi Pakan');
    
    expect(teknikBudidaya).toBeInTheDocument();
    expect(nutrisiPakan).toBeInTheDocument();
    
    // Verifikasi warna latar belakang kategori
    // Note: getComputedStyle tidak berfungsi di Jest tanpa tambahan konfigurasi,
    // jadi kita memeriksa class name saja
    expect(teknikBudidaya.className).toContain('bg-amber-600');
    expect(nutrisiPakan.className).toContain('bg-red-800');
  });

  test('calculates and displays reading time correctly', () => {
    render(<DetailArtikel article={mockArticle} />);
    
    // Menghitung estimasi waktu baca
    const wordCount = mockArticle.synopsis.split(" ").length;
    const expectedReadingTime = Math.ceil(wordCount / 200);
    
    expect(screen.getByText(new RegExp(`${expectedReadingTime} menit untuk membaca`))).toBeInTheDocument();
  });

  test('handles article with different categories', () => {
    const articleWithDifferentCategory = {
      ...mockArticle,
      categories: ['Kisah Inspiratif']
    };
    
    render(<DetailArtikel article={articleWithDifferentCategory} />);
    
    const kisahInspiratif = screen.getByText('Kisah Inspiratif');
    expect(kisahInspiratif).toBeInTheDocument();
    expect(kisahInspiratif.className).toContain('bg-green-600');
  });

  test('handles article with unknown category', () => {
    const articleWithUnknownCategory = {
      ...mockArticle,
      categories: ['Kategori Baru']
    };
    
    render(<DetailArtikel article={articleWithUnknownCategory} />);
    
    const newCategory = screen.getByText('Kategori Baru');
    expect(newCategory).toBeInTheDocument();
    // Kategori yang tidak dikenal akan menggunakan warna default
    expect(newCategory.className).toContain('bg-gray-500');
  });
  
  test('handles article with empty categories array', () => {
    const articleWithNoCategories = {
      ...mockArticle,
      categories: []
    };
    
    render(<DetailArtikel article={articleWithNoCategories} />);
    
    // Cek bahwa tidak ada elemen kategori yang ditampilkan
    // Karena div kategori ada tetapi tidak memiliki anak (children)
    const allCategoryElements = screen.queryAllByText(/Kisah|Teknik|Nutrisi|Kategori/);
    expect(allCategoryElements).toHaveLength(0);
  });

  test('handles article with very short synopsis for reading time calculation', () => {
    const articleWithShortSynopsis = {
      ...mockArticle,
      synopsis: 'Ini sinopsis pendek.'
    };
    
    render(<DetailArtikel article={articleWithShortSynopsis} />);
    
    // Dengan kata yang sangat sedikit, waktu baca seharusnya 1 menit
    expect(screen.getByText(/1 menit untuk membaca/)).toBeInTheDocument();
  });
  
  test('handles article with very long synopsis for reading time calculation', () => {
    // Buat synopsis yang panjang dengan mengulang text
    let longSynopsis = '';
    for (let i = 0; i < 50; i++) {
      longSynopsis += mockArticle.synopsis + ' ';
    }
    
    const articleWithLongSynopsis = {
      ...mockArticle,
      synopsis: longSynopsis
    };
    
    render(<DetailArtikel article={articleWithLongSynopsis} />);
    
    // Memeriksa jika waktu baca dihitung dengan benar untuk teks yang sangat panjang
    const wordCount = longSynopsis.split(' ').length;
    const expectedReadingTime = Math.ceil(wordCount / 200);
    expect(screen.getByText(new RegExp(`${expectedReadingTime} menit untuk membaca`))).toBeInTheDocument();
  });
});