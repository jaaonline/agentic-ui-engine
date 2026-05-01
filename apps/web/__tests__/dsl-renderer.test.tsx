import { render, screen, fireEvent } from '@testing-library/react'
import { DSLRenderer } from '../components/renderer/DSLRenderer'

const mockLoginSchema = {
  id: 'login_form',
  version: '1.0',
  layout: 'stack',
  components: [
    {
      type: 'input',
      id: 'email_input',
      props: { label: 'Email', placeholder: 'Enter email', inputType: 'email', required: true }
    },
    {
      type: 'input',
      id: 'password_input',
      props: { label: 'Password', placeholder: 'Enter password', inputType: 'password', required: true }
    },
    {
      type: 'button',
      id: 'submit_btn',
      props: { label: 'Sign in', variant: 'primary', fullWidth: true }
    }
  ],
  interactions: [
    {
      trigger: 'click',
      sourceId: 'submit_btn',
      action: 'submit',
      successMessage: 'Login successful!',
      errorMessage: 'Please fill in all required fields.'
    }
  ]
}

describe('DSLRenderer', () => {
  it('renders input components correctly', () => {
    render(<DSLRenderer schema={mockLoginSchema} />)
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
  })

  it('renders button component correctly', () => {
    render(<DSLRenderer schema={mockLoginSchema} />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('shows error when submitting empty required fields', () => {
    render(<DSLRenderer schema={mockLoginSchema} />)
    fireEvent.click(screen.getByText('Sign in'))
    const errors = screen.getAllByText('Please fill in all required fields.')
    expect(errors.length).toBeGreaterThan(0)
  })

  it('shows success message when form is filled correctly', () => {
    render(<DSLRenderer schema={mockLoginSchema} />)
    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByText('Sign in'))
    expect(screen.getByText(/Login successful!/)).toBeInTheDocument()
  })

  it('returns null when schema is null', () => {
    const { container } = render(<DSLRenderer schema={null} />)
    expect(container.firstChild).toBeNull()
  })
})