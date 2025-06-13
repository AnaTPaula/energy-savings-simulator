import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '@/components/Modal'

describe('Modal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('should render correctly when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('should call onClose when the close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should apply error classes when isError is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal" isError={true}>
        <div>Modal Content</div>
      </Modal>
    )

    const modalContainer = screen.getByText('Test Modal').closest('div')
    expect(modalContainer).toHaveClass('bg-red-50')
    expect(screen.getByText('Test Modal')).toHaveClass('text-red-800')
  })
}) 