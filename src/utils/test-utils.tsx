import React, { ReactElement } from 'react'
import { render, RenderOptions, cleanup } from '@testing-library/react'

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  cleanup() // Clean up before each render
  return render(<React.StrictMode>{ui}</React.StrictMode>, { ...options })
}

export * from '@testing-library/react'
export { customRender as render }
