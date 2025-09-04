export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  description: string;
  imageUrl?: string;
  isbn?: string;
  pageCount?: number;
  categories: string[];
}

export interface Review {
  id: string;
  bookId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  votes: number;
}

// Tipos para la API de Google Books
export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    pageCount?: number;
    categories?: string[];
  };
}

export interface GoogleBooksResponse {
  items?: GoogleBookVolume[];
  totalItems: number;
}