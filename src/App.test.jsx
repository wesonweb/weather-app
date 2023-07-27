import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('Should render a form to enter location', () => {

  it('Displays a form input on the page', async () =>  {
    render(<App />)
    const input = screen.getByRole("textbox")
    expect(input).toBeInTheDocument()
  }
  )
})
