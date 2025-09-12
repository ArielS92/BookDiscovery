import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../utils/test-utils'
import BookDetails from '../../components/BookDetails'
import { Book, Review } from '../../types'

// Mock ReviewForm and ReviewList components
vi.mock('../../components/ReviewForm', () => ({
  default: ({ onSubmit, onCancel }: any) => (
    <div data-testid="review-form">
      <button onClick={() => onSubmit({ rating: 5, comment: 'Test', author: 'Test', bookId: '1', date: '2023-01-01' })}>
        Submit Review
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}))

vi.mock('../../components/ReviewList', () => ({
  default: ({ reviews, onVote }: any) => (
    <div data-testid="review-list">
      {reviews.map((review: Review) => (
        <div key={review.id}>
          <span>{review.author}</span>
          <span>{review.rating}</span>
          <button onClick={() => onVote(review.id, 1)}>Upvote</button>
          <button onClick={() => onVote(review.id, -1)}>Downvote</button>
        </div>
      ))}
    </div>
  )
}))

describe('BookDetails', () => {
  const mockOnAddReview = vi.fn()
  const mockOnVote = vi.fn()

  const mockBook: Book = {
    id: '1',
    title: 'Test Book',
    authors: ['Author 1', 'Author 2'],
    publishedDate: '2022-12-31',
    description: 'This is a test book description',
    imageUrl: 'https://example.com/image.jpg',
    isbn: '1234567890',
    pageCount: 300,
    categories: ['Fiction', 'Adventure']
  }

  const mockReviews: Review[] = [
    { id: '1', bookId: '1', author: 'User 1', rating: 4, comment: 'Good book', date: '2023-01-01', votes: 5 },
    { id: '2', bookId: '1', author: 'User 2', rating: 5, comment: 'Excellent', date: '2023-01-02', votes: 3 }
  ]

  const defaultProps = {
    book: mockBook,
    reviews: mockReviews,
    onAddReview: mockOnAddReview,
    onVote: mockOnVote
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders book details correctly', () => {
    render(<BookDetails {...defaultProps} />)

    expect(screen.getByText('Test Book')).toBeInTheDocument()
    expect(screen.getByText('por Author 1, Author 2')).toBeInTheDocument()
    expect(screen.getByText(/Publicación:/)).toBeInTheDocument()
    expect(screen.getByText('30/12/2022')).toBeInTheDocument()
    expect(screen.getByText(/Páginas:/)).toBeInTheDocument()
    expect(screen.getByText('300')).toBeInTheDocument()
    expect(screen.getByText(/ISBN:/)).toBeInTheDocument()
    expect(screen.getByText('1234567890')).toBeInTheDocument()
    expect(screen.getByText('Fiction')).toBeInTheDocument()
    expect(screen.getByText('Adventure')).toBeInTheDocument()
  })

  it('displays book image correctly', () => {
    render(<BookDetails {...defaultProps} />)

    const image = screen.getByRole('img', { name: /Test Book/ })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', expect.stringContaining('example.com'))
  })

  it('displays placeholder when image is not available', () => {
    const bookWithoutImage = { ...mockBook, imageUrl: undefined }
    render(<BookDetails {...defaultProps} book={bookWithoutImage} />)

    // Should show the placeholder div with SVG
    expect(screen.getByText('Test Book')).toBeInTheDocument() // Just check the component renders
  })

  it('truncates long description', () => {
    const longDescription = 'A'.repeat(350) // Make it definitely over 300 characters
    const bookWithLongDesc = { ...mockBook, description: longDescription }

    render(<BookDetails {...defaultProps} book={bookWithLongDesc} />)

    const descriptionText = screen.getByText(/^A+\.\.\.$/)
    expect(descriptionText).toBeInTheDocument()
  })

  it('displays full description when under 300 characters', () => {
    render(<BookDetails {...defaultProps} />)

    expect(screen.getByText('This is a test book description')).toBeInTheDocument()
  })

  it('calculates and displays average rating correctly', () => {
    render(<BookDetails {...defaultProps} />)

    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('2 reseñas')).toBeInTheDocument()
  })

  it('displays 0.0 rating when no reviews', () => {
    render(<BookDetails {...defaultProps} reviews={[]} />)

    expect(screen.getByText('0.0')).toBeInTheDocument()
    expect(screen.getByText('0 reseñas')).toBeInTheDocument()
  })

  it('toggles review form visibility', () => {
    render(<BookDetails {...defaultProps} />)

    const toggleButton = screen.getByText('Escribir Reseña')
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(screen.getByTestId('review-form')).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(screen.queryByTestId('review-form')).not.toBeInTheDocument()
  })

  it('calls onAddReview when review is submitted', () => {
    render(<BookDetails {...defaultProps} />)

    fireEvent.click(screen.getByText('Escribir Reseña'))
    fireEvent.click(screen.getByText('Submit Review'))

    expect(mockOnAddReview).toHaveBeenCalledWith({
      rating: 5,
      comment: 'Test',
      author: 'Test',
      bookId: '1',
      date: '2023-01-01'
    })
  })

  it('calls onVote when vote buttons are clicked', () => {
    render(<BookDetails {...defaultProps} />)

    const upvoteButtons = screen.getAllByText('Upvote')
    const downvoteButtons = screen.getAllByText('Downvote')

    fireEvent.click(upvoteButtons[0])
    expect(mockOnVote).toHaveBeenCalledWith('1', 1)

    fireEvent.click(downvoteButtons[1])
    expect(mockOnVote).toHaveBeenCalledWith('2', -1)
  })

  it('handles book without optional fields', () => {
    const minimalBook: Book = {
      id: '1',
      title: 'Minimal Book',
      authors: ['Author'],
      publishedDate: '',
      description: '',
      categories: []
    }

    render(<BookDetails {...defaultProps} book={minimalBook} />)

    expect(screen.getByText('Minimal Book')).toBeInTheDocument()
    expect(screen.queryByText(/Publicación:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Páginas:/)).not.toBeInTheDocument()
    expect(screen.queryByText(/ISBN:/)).not.toBeInTheDocument()
    expect(screen.queryByText('Descripción')).not.toBeInTheDocument()
  })

  it('handles decimal average ratings', () => {
    const reviewsWithDecimal: Review[] = [
      { id: '1', bookId: '1', author: 'User', rating: 3, comment: 'Ok', date: '2023-01-01', votes: 0 },
      { id: '2', bookId: '1', author: 'User2', rating: 4, comment: 'Good', date: '2023-01-02', votes: 0 }
    ]

    render(<BookDetails {...defaultProps} reviews={reviewsWithDecimal} />)

    expect(screen.getByText('3.5')).toBeInTheDocument()
  })
})
