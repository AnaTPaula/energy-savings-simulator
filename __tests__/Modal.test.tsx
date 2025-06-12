import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '@/components/Modal'

describe('Modal', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    mockOnClose.mockClear()
  })

  it('não deve renderizar quando isOpen é false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument()
  })

  it('deve renderizar corretamente quando isOpen é true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Modal Content')).toBeInTheDocument()
  })

  it('deve chamar onClose quando o botão de fechar é clicado', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    )

    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('deve aplicar classes de erro quando isError é true', () => {
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