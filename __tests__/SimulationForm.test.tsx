import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SimulationForm } from '@/components/SimulationForm'

// Mock do fetch global
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('SimulationForm', () => {
  beforeEach(() => {
    // Resetar o mock antes de cada teste
    mockFetch.mockReset()
    // Configurar o mock para retornar sucesso
    mockFetch.mockResolvedValueOnce({ ok: true })
    render(<SimulationForm />)
  })

  it('deve renderizar o formulário corretamente', () => {
    expect(screen.getByText('Dados de Consumo')).toBeInTheDocument()
    expect(screen.getByText('Seus Dados')).toBeInTheDocument()
    expect(screen.getByText('Simular Economia')).toBeInTheDocument()
  })

  it('deve validar campos obrigatórios', async () => {
    // Preencher apenas os campos de consumo para habilitar a validação dos outros campos
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    await userEvent.type(screen.getByLabelText('Cidade*'), 'São Paulo')
    await userEvent.type(screen.getByLabelText('Estado (UF)*'), 'SP')

    // Preencher campos obrigatórios com valores inválidos
    const nameInput = screen.getByLabelText('Nome*')
    const emailInput = screen.getByLabelText('E-mail*')
    const phoneInput = screen.getByLabelText('Telefone*')
    const cpfInput = screen.getByLabelText('CPF*')

    // Preencher com valores inválidos
    await userEvent.type(nameInput, 'Jo') // Menos de 3 caracteres
    await userEvent.type(emailInput, 'email-invalido') // Email inválido
    await userEvent.type(phoneInput, '123') // Menos de 10 caracteres
    await userEvent.type(cpfInput, '123') // Menos de 11 dígitos

    // Simular blur em cada campo obrigatório
    fireEvent.blur(nameInput)
    fireEvent.blur(emailInput)
    fireEvent.blur(phoneInput)
    fireEvent.blur(cpfInput)

    // Verificar mensagens de erro
    await waitFor(() => {
      expect(screen.getByText('Nome deve ter pelo menos 3 caracteres')).toBeInTheDocument()
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
      expect(screen.getByText('Telefone inválido')).toBeInTheDocument()
      expect(screen.getByText('CPF deve ter 11 dígitos')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('deve calcular a economia corretamente', async () => {
    // Preencher todos os campos
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    await userEvent.type(screen.getByLabelText('Cidade*'), 'São Paulo')
    await userEvent.type(screen.getByLabelText('Estado (UF)*'), 'SP')
    await userEvent.type(screen.getByLabelText('Nome*'), 'João Silva')
    await userEvent.type(screen.getByLabelText('E-mail*'), 'joao@email.com')
    await userEvent.type(screen.getByLabelText('Telefone*'), '11999999999')
    await userEvent.type(screen.getByLabelText('CPF*'), '12345678900')

    // Enviar formulário
    const submitButton = screen.getByText('Simular Economia')
    fireEvent.click(submitButton)

    // Verificar se a API foi chamada com os dados corretos
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

  it('deve validar formato de email', async () => {
    // Preencher campos de consumo para habilitar o botão
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    await userEvent.type(screen.getByLabelText('Cidade*'), 'São Paulo')
    await userEvent.type(screen.getByLabelText('Estado (UF)*'), 'SP')

    // Preencher email inválido
    await userEvent.type(screen.getByLabelText('E-mail*'), 'email-invalido')
    fireEvent.blur(screen.getByLabelText('E-mail*'))

    // Tentar enviar o formulário
    const submitButton = screen.getByText('Simular Economia')
    fireEvent.click(submitButton)

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
    })
  })

  it('deve validar formato de CPF', async () => {
    // Preencher campos de consumo para habilitar o botão
    await userEvent.type(screen.getByLabelText('Valor Mensal da Conta (R$)*'), '1000')
    await userEvent.type(screen.getByLabelText('Cidade*'), 'São Paulo')
    await userEvent.type(screen.getByLabelText('Estado (UF)*'), 'SP')

    // Preencher CPF inválido
    await userEvent.type(screen.getByLabelText('CPF*'), '123')
    fireEvent.blur(screen.getByLabelText('CPF*'))

    // Tentar enviar o formulário
    const submitButton = screen.getByText('Simular Economia')
    fireEvent.click(submitButton)

    // Verificar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('CPF deve ter 11 dígitos')).toBeInTheDocument()
    })
  })
}) 