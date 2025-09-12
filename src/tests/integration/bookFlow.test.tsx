import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import Home from '../../app/page'

describe('Book Flow Integration', () => {
  const mockBookData = {
    items: [
      {
        id: '1',
        volumeInfo: {
          title: 'Test Book',
          authors: ['Test Author'],
          publishedDate: '2023-01-01',
          description: 'Test description',
          imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Test+Book' },
          industryIdentifiers: [{ identifier: '1234567890' }],
          pageCount: 200,
          categories: ['Fiction'],
        },
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBookData,
    })
  })

  it('completes full book search and review flow', async () => {
    render(<Home />)
    
    // Search for a book
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchInput, { target: { value: 'Test Book' } })
    fireEvent.click(searchButton)
    
    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument()
    })
    
    // Select a book
    const bookItem = screen.getByText('Test Book')
    fireEvent.click(bookItem)
    
    // Write a review
    const reviewButton = screen.getByText('Escribir Reseña')
    fireEvent.click(reviewButton)
    
    const commentInput = screen.getByPlaceholderText('Escribe tu reseña aquí...')
    const stars = screen.getAllByText('★')
    const submitButton = screen.getByText('Enviar Reseña')
    
    fireEvent.change(commentInput, { target: { value: 'Excellent book!' } })
    fireEvent.click(stars[4]) // 5 stars
    fireEvent.click(submitButton)
    
    // Verify review was added
    await waitFor(() => {
      expect(screen.getByText('Excellent book!')).toBeInTheDocument()
    })
  })

  it('handles empty search results', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    })
    
    render(<Home />)
    
    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    
    fireEvent.change(searchInput, { target: { value: 'Nonexistent Book' } })
    fireEvent.click(searchButton)
    
    await waitFor(() => {
      expect(screen.getByText('No hay libros para mostrar')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    render(<Home />)

    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })

    fireEvent.change(searchInput, { target: { value: 'Test' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('shows pagination when there are multiple pages of results', async () => {
    const mockBookDataWithPagination = {
      totalItems: 100,
      items: Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        volumeInfo: {
          title: `Test Book ${i + 1}`,
          authors: ['Test Author'],
          publishedDate: '2023-01-01',
          description: 'Test description',
          imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Test+Book' },
          industryIdentifiers: [{ identifier: `123456789${i}` }],
          pageCount: 200,
          categories: ['Fiction'],
        },
      })),
    }

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockBookDataWithPagination,
    })

    render(<Home />)

    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })

    fireEvent.change(searchInput, { target: { value: 'Test' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('Test Book 1')).toBeInTheDocument()
    })

    // Check that pagination controls appear
    expect(screen.getByText('Siguiente')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('navigates to next page when clicking pagination button', async () => {
    const mockBookDataPage1 = {
      totalItems: 100,
      items: Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        volumeInfo: {
          title: `Test Book Page 1 - ${i + 1}`,
          authors: ['Test Author'],
          publishedDate: '2023-01-01',
          description: 'Test description',
          imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Test+Book' },
          industryIdentifiers: [{ identifier: `123456789${i}` }],
          pageCount: 200,
          categories: ['Fiction'],
        },
      })),
    }

    const mockBookDataPage2 = {
      totalItems: 100,
      items: Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 21}`,
        volumeInfo: {
          title: `Test Book Page 2 - ${i + 21}`,
          authors: ['Test Author'],
          publishedDate: '2023-01-01',
          description: 'Test description',
          imageLinks: { thumbnail: 'https://via.placeholder.com/128x192.png?text=Test+Book' },
          industryIdentifiers: [{ identifier: `123456789${i + 20}` }],
          pageCount: 200,
          categories: ['Fiction'],
        },
      })),
    }

    let callCount = 0
    global.fetch = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve({
        ok: true,
        json: async () => callCount === 1 ? mockBookDataPage1 : mockBookDataPage2,
      })
    })

    render(<Home />)

    const searchInput = screen.getByPlaceholderText('Título del libro...')
    const searchButton = screen.getByRole('button', { name: 'Buscar' })

    fireEvent.change(searchInput, { target: { value: 'Test' } })
    fireEvent.click(searchButton)

    await waitFor(() => {
      expect(screen.getByText('Test Book Page 1 - 1')).toBeInTheDocument()
    })

    // Click next page
    const nextButton = screen.getByText('Siguiente')
    fireEvent.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Test Book Page 2 - 21')).toBeInTheDocument()
    })

    // Verify API was called with correct startIndex
    expect(global.fetch).toHaveBeenCalledTimes(2)
    expect(global.fetch).toHaveBeenNthCalledWith(2,
      expect.stringContaining('startIndex=20')
    )
  })
})