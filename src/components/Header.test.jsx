import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Should render heading text', () => {
  it('Displays heading correctly', () =>  {
    render(<Header />)
    const title = screen.getByText(/weather app/i)
    expect(title).toBeInTheDocument()
  })
  it('Ensures heading is present', () =>  {
    render(<Header />)
    const headingElement = screen.getByRole("heading")
    expect(headingElement).toBeInTheDocument()
  })

})
