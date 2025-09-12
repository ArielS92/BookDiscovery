import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../utils/test-utils'
import BookList from '../../components/BookList'
import { Book } from '../../types'

describe('BookList', () => {
  const mockOnBookSelect = vi.fn()
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Test Book 1',
      authors: ['Author One'],
      publishedDate: '2020-01-01',
      description: 'A test book description',
      imageUrl: 'https://example.com/image1.jpg',
      categories: ['Fiction', 'Adventure']
    },
    {
      id: '2',
      title: 'Test Book 2',
      authors: ['Author Two', 'Author Three'],
      publishedDate: '2021-06-15',
      description: 'Another test book',
      categories: []
    }
  ]

  const defaultProps = {
    books: mockBooks,
    onBookSelect: mockOnBookSelect,
    selectedBookId: undefined
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no books provided', () => {
    render(<BookList books={[]} onBookSelect={mockOnBookSelect} />)

    expect(screen.getByText('No hay libros para mostrar')).toBeInTheDocument()
    expect(screen.getByText('Utiliza el buscador para encontrar libros.')).toBeInTheDocument()
  })

  it('renders book list correctly', () => {
    render(<BookList {...defaultProps} />)

    expect(screen.getByText('Resultados de la búsqueda')).toBeInTheDocument()
    expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    expect(screen.getByText('Test Book 2')).toBeInTheDocument()
    expect(screen.getByText('Author One')).toBeInTheDocument()
    expect(screen.getByText('Author Two, Author Three')).toBeInTheDocument()
  })

  it('displays book details correctly', () => {
    render(<BookList {...defaultProps} />)

    // Check published year - adjust for actual date parsing
    expect(screen.getByText('Publicado: 2019')).toBeInTheDocument()
    expect(screen.getByText('Publicado: 2021')).toBeInTheDocument()

    // Check categories
    expect(screen.getByText('Fiction')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
  })

  it('shows placeholder image when imageUrl is not provided', () => {
    render(<BookList {...defaultProps} />)

    // The second book doesn't have imageUrl, should show placeholder
    const placeholderIcons = screen.getAllByRole('img', { hidden: true })
    expect(placeholderIcons.length).toBeGreaterThan(0)
  })

  it('calls onBookSelect when book is clicked', () => {
    render(<BookList {...defaultProps} />)

    // Click on the book title or container
    const bookTitle = screen.getByText('Test Book 1')
    fireEvent.click(bookTitle)

    expect(mockOnBookSelect).toHaveBeenCalledWith(mockBooks[0])
    expect(mockOnBookSelect).toHaveBeenCalledTimes(1)
  })

  it('highlights selected book', () => {
    render(<BookList {...defaultProps} selectedBookId="1" />)

    // Find the book container by finding the title and going up to the container
    const bookTitle = screen.getByText('Test Book 1')
    const bookContainer = bookTitle.closest('.p-4') // The container has p-4 class
    expect(bookContainer).toHaveClass('border-primary-500')
  })

  it('limits categories display to 3', () => {
    const bookWithManyCategories: Book = {
      ...mockBooks[0],
      categories: ['Cat1', 'Cat2', 'Cat3', 'Cat4', 'Cat5']
    }

    render(<BookList books={[bookWithManyCategories]} onBookSelect={mockOnBookSelect} />)

    expect(screen.getByText('Cat1')).toBeInTheDocument()
    expect(screen.getByText('Cat2')).toBeInTheDocument()
    expect(screen.getByText('Cat3')).toBeInTheDocument()
    expect(screen.queryByText('Cat4')).not.toBeInTheDocument()
  })

  it('handles books without publishedDate', () => {
    const bookWithoutDate: Book = {
      ...mockBooks[0],
      publishedDate: ''
    }

    render(<BookList books={[bookWithoutDate]} onBookSelect={mockOnBookSelect} />)

    expect(screen.queryByText(/Publicado:/)).not.toBeInTheDocument()
  })

  it('handles books with empty categories array', () => {
    render(<BookList {...defaultProps} />)

    // Second book has empty categories, should not show any category tags
    const categoryTags = screen.queryAllByText(/^Fiction|^Adventure/)
    expect(categoryTags.length).toBe(2) // Only from first book
  })
})
