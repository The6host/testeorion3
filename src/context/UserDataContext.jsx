import { createContext, useContext } from 'react'

export const UserDataContext = createContext(null)

export function useUserDataContext() {
  const ctx = useContext(UserDataContext)
  if (!ctx) {
    throw new Error('useUserDataContext deve ser usado dentro de UserDataProvider')
  }
  return ctx
}
