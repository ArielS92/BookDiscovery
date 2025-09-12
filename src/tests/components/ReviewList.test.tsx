import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../utils/test-utils'
import ReviewList from '../../components/ReviewList'
import { Review } from '../../types'

describe('ReviewList', () => {
  const mockOnVote = vi.fn()
  const mockReviews: Review[] = [
    { id: '1', bookId: '1', author: 'User 1', rating: 4, comment: 'Good book', date: '2023-01-01', votes: 5 },
    { id: '2', bookId: '1', author: 'User 2', rating: 5, comment: 'Excellent', date: '2023-01-02', votes: 3 },
    { id: '3', bookId: '1', author: 'User 3', rating: 3, comment: 'Average', date: '2023-01-03', votes: 10 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders empty state when no reviews', () => {
    render(<ReviewList reviews={[]} onVote={mockOnVote} />)

    expect(screen.getByText('No hay reseñas todavía. Sé el primero en opinar.')).toBeInTheDocument()
  })

  it('renders reviews sorted by votes descending', () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />)

    const authors = screen.getAllByText(/User \d/)
    expect(authors[0]).toHaveTextContent('User 3') // Highest votes first
    expect(authors[1]).toHaveTextContent('User 1')
    expect(authors[2]).toHaveTextContent('User 2')
  })

  it('calls onVote with correct parameters when upvote/downvote clicked', () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />)

    const upvoteButtons = screen.getAllByTitle('Votar a favor')
    const downvoteButtons = screen.getAllByTitle('Votar en contra')

    fireEvent.click(upvoteButtons[0])
    expect(mockOnVote).toHaveBeenCalledWith('3', 1)

    fireEvent.click(downvoteButtons[1])
    expect(mockOnVote).toHaveBeenCalledWith('1', -1)
  })

  it('renders stars correctly for each review', () => {
    render(<ReviewList reviews={mockReviews} onVote={mockOnVote} />)

    mockReviews.forEach((review) => {
      const starString = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating)
      expect(screen.getByText(starString)).toBeInTheDocument()
    })
  })
})
