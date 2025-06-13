import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimulationForm } from '@/components/SimulationForm'

// Mock global fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SimulationForm', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockFetch.mockReset()
    
    // Mock IBGE API responses
    mockFetch.mockImplementation((url) => {
      if (url.includes('servicodados.ibge.gov.br/api/v1/localidades/estados')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, sigla: 'SP', nome: 'São Paulo' },
            { id: 2, sigla: 'RJ', nome: 'Rio de Janeiro' }
          ])
        })
      }
      if (url.includes('servicodados.ibge.gov.br/api/v1/localidades/estados/SP/municipios')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([
            { id: 1, nome: 'São Paulo' },
            { id: 2, nome: 'Campinas' }
          ])
        })
      }
      // Default mock for simulation API
      return Promise.resolve({ ok: true })
    })

    render(<SimulationForm />)
  })

  it('should render the form correctly', () => {
    expect(screen.getByText('Dados de Consumo')).toBeInTheDocument()
    expect(screen.getByText('Seus Dados')).toBeInTheDocument()
    expect(screen.getByText('Simular Economia')).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    // Fill only consumption fields to enable validation of other fields
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    
    // Select state and city from dropdowns
    const stateSelect = screen.getByLabelText('Estado (UF)*')
    const citySelect = screen.getByLabelText('Cidade*')
    
    await userEvent.selectOptions(stateSelect, 'SP')
    await userEvent.selectOptions(citySelect, 'São Paulo')

    // Fill required fields with invalid values
    const nameInput = screen.getByLabelText('Nome*')
    const emailInput = screen.getByLabelText('E-mail*')
    const phoneInput = screen.getByLabelText('Telefone*')
    const cpfInput = screen.getByLabelText('CPF*')

    // Fill with invalid values
    await userEvent.type(nameInput, 'Jo') // Less than 3 characters
    await userEvent.type(emailInput, 'email-invalido') // Invalid email
    await userEvent.type(phoneInput, '123') // Less than 10 characters
    await userEvent.type(cpfInput, '123') // Less than 11 digits

    // Simulate blur on each required field
    fireEvent.blur(nameInput)
    fireEvent.blur(emailInput)
    fireEvent.blur(phoneInput)
    fireEvent.blur(cpfInput)

    // Check error messages
    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 3 caracteres')).toBeInTheDocument()
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
      expect(screen.getByText('Telefone inválido')).toBeInTheDocument()
      expect(screen.getByText('CPF deve ter 11 dígitos')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should calculate savings correctly', async () => {
    // Fill all fields
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    
    // Select state and city from dropdowns
    const stateSelect = screen.getByLabelText('Estado (UF)*')
    const citySelect = screen.getByLabelText('Cidade*')
    
    await userEvent.selectOptions(stateSelect, 'SP')
    await userEvent.selectOptions(citySelect, 'São Paulo')
    
    await userEvent.type(screen.getByLabelText('Nome*'), 'João Silva')
    await userEvent.type(screen.getByLabelText('E-mail*'), 'joao@email.com')
    await userEvent.type(screen.getByLabelText('Telefone*'), '11999999999')
    await userEvent.type(screen.getByLabelText('CPF*'), '12345678900')

    // Submit form
    const submitButton = screen.getByText('Simular Economia')
    fireEvent.click(submitButton)

    // Check if API was called with correct data
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/simulation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '11999999999',
          cpf: '12345678900',
          consumption: {
            monthlyBill: 1000,
            city: 'São Paulo',
            state: 'SP',
            supplyType: 'Monofásico'
          }
        })
      })
    })
  })

  it('should validate email format', async () => {
    // Fill consumption fields to enable the button
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    
    // Select state and city from dropdowns
    const stateSelect = screen.getByLabelText('Estado (UF)*')
    const citySelect = screen.getByLabelText('Cidade*')
    
    await userEvent.selectOptions(stateSelect, 'SP')
    await userEvent.selectOptions(citySelect, 'São Paulo')

    // Fill invalid email
    await userEvent.type(screen.getByLabelText('E-mail*'), 'email-invalido')
    fireEvent.blur(screen.getByLabelText('E-mail*'))

    // Try to submit the form
    const submitButton = screen.getByText('Simular Economia')
    fireEvent.click(submitButton)

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })
  })

  it('should validate CPF format', async () => {
    // Fill consumption fields to enable the button
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    
    // Select state and city from dropdowns
    const stateSelect = screen.getByLabelText('Estado (UF)*')
    const citySelect = screen.getByLabelText('Cidade*')
    
    await userEvent.selectOptions(stateSelect, 'SP')
    await userEvent.selectOptions(citySelect, 'São Paulo')

    // Fill invalid CPF
    await userEvent.type(screen.getByLabelText('CPF*'), '123')
    fireEvent.blur(screen.getByLabelText('CPF*'))

    // Try to submit the form
    const submitButton = screen.getByText('Simular Economia')
    fireEvent.click(submitButton)

    // Check error message
    await waitFor(() => {
      expect(screen.getByText('CPF deve ter 11 dígitos')).toBeInTheDocument()
    })
  })
}) 