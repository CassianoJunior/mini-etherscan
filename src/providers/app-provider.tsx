'use client'

import { ReactNode } from 'react'
import { QueryClientProvider } from './query-client-provider'

type AppProviderProps = {
	children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
	return <QueryClientProvider>{children}</QueryClientProvider>
}
