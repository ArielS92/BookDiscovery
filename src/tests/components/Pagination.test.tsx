import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../utils/test-utils'
import Pagination from '../../components/Pagination'

describe('Pagination', () => {
  const mockOnPageChange = vi.fn()

  beforeEach(() => {
    mockOnPageChange.mockClear()
  })

  it('no se renderiza cuando hay solo una página', () => {
    render(
      <Pagination
        currentPage={1}
        totalItems={10}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.queryByText('Anterior')).not.toBeInTheDocument()
    expect(screen.queryByText('Siguiente')).not.toBeInTheDocument()
  })

  it('renderiza correctamente con múltiples páginas', () => {
    render(
      <Pagination
        currentPage={1}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    expect(screen.getByText('Anterior')).toBeInTheDocument()
    expect(screen.getByText('Siguiente')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('deshabilita el botón Anterior en la primera página', () => {
    render(
      <Pagination
        currentPage={1}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByText('Anterior')
    expect(prevButton).toBeDisabled()
  })

  it('deshabilita el botón Siguiente en la última página', () => {
    render(
      <Pagination
        currentPage={5}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('Siguiente')
    expect(nextButton).toBeDisabled()
  })

  it('llama onPageChange cuando se hace clic en un número de página', () => {
    render(
      <Pagination
        currentPage={1}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const page2Button = screen.getByText('2')
    fireEvent.click(page2Button)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('llama onPageChange cuando se hace clic en Anterior', () => {
    render(
      <Pagination
        currentPage={3}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const prevButton = screen.getByText('Anterior')
    fireEvent.click(prevButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('llama onPageChange cuando se hace clic en Siguiente', () => {
    render(
      <Pagination
        currentPage={1}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const nextButton = screen.getByText('Siguiente')
    fireEvent.click(nextButton)

    expect(mockOnPageChange).toHaveBeenCalledWith(2)
  })

  it('muestra puntos suspensivos cuando hay muchas páginas', () => {
    render(
      <Pagination
        currentPage={5}
        totalItems={500}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const ellipsisElements = screen.queryAllByText('...')
    expect(ellipsisElements.length).toBeGreaterThan(0)
  })

  it('resalta la página actual', () => {
    render(
      <Pagination
        currentPage={3}
        totalItems={100}
        itemsPerPage={20}
        onPageChange={mockOnPageChange}
      />
    )

    const currentPageButton = screen.getByText('3')
    expect(currentPageButton).toHaveClass('bg-gray-600')
  })
})
