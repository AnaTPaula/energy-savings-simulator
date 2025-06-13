import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LeadsTable } from '@/components/LeadsTable'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      refresh: jest.fn()
    }
  }
}))

const mockLeads = [
  {
    id: 1,
    name: 'João Silva',
    city: 'São Paulo',
    state: 'SP',
    billValue: 1000
  },
  {
    id: 2,
    name: 'Maria Santos',
    city: 'Rio de Janeiro',
    state: 'RJ',
    billValue: 1500
  }
]

describe('LeadsTable', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render the table with leads correctly', () => {
    render(<LeadsTable leads={mockLeads} onDelete={jest.fn()} searchTerm="" />)

    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    expect(screen.getByText('R$ 1.000,00')).toBeInTheDocument()
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument()
  })

  it('should open the confirmation modal when clicking delete', () => {
    render(<LeadsTable leads={mockLeads} onDelete={jest.fn()} searchTerm="" />)

    const deleteButtons = screen.getAllByText('Excluir')
    fireEvent.click(deleteButtons[0])

    expect(screen.getAllByText('Confirmar Exclusão')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Confirmar Exclusão')[1]).toBeInTheDocument()
    expect(screen.getByText('Tem certeza que deseja excluir este lead?')).toBeInTheDocument()
  })

  it('should close the modal when clicking cancel', () => {
    render(<LeadsTable leads={mockLeads} onDelete={jest.fn()} searchTerm="" />)

    const deleteButton = screen.getAllByText('Excluir')[0]
    fireEvent.click(deleteButton)

    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)

    expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument()
  })

  it('should call the delete API on confirmation', async () => {
    const mockOnDelete = jest.fn().mockResolvedValue(undefined)
    render(<LeadsTable leads={mockLeads} onDelete={mockOnDelete} searchTerm="" />)

    const deleteButton = screen.getAllByText('Excluir')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getAllByText('Confirmar Exclusão')[1]
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1')
    })
  })

  it('should show error message when deletion fails', async () => {
    const mockOnDelete = jest.fn().mockRejectedValueOnce(new Error('Erro ao excluir'))
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(<LeadsTable leads={mockLeads} onDelete={mockOnDelete} searchTerm="" />)

    const deleteButton = screen.getAllByText('Excluir')[0]
    fireEvent.click(deleteButton)

    const confirmButton = screen.getAllByText('Confirmar Exclusão')[1]
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Erro ao excluir lead:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })
}) 