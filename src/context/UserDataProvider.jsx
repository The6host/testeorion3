import { UserDataContext } from './UserDataContext'
import { useUserData } from '../hooks/useUserData'

export function UserDataProvider({ children }) {
  const userDataValue = useUserData()
  return (
    <UserDataContext.Provider value={userDataValue}>
      {children}
    </UserDataContext.Provider>
  )
}
