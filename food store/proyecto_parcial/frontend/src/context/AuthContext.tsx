import { createContext, useContext, useState, ReactNode } from 'react'

type Rol = 'ADMIN' | 'CONSULTA'

interface AuthUser {
  username: string
  rol: Rol
  token: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  role: Rol | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (username: string, password: string) => {
    const res = await fetch('http://localhost:8000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Error al iniciar sesión')
    }
    const data = await res.json()
    const authUser: AuthUser = {
      username: data.username,
      rol: data.rol,
      token: data.access_token,
    }
    setUser(authUser)
    localStorage.setItem('auth_user', JSON.stringify(authUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider value={{
      user,
      token: user?.token ?? null,
      role: user?.rol ?? null,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
