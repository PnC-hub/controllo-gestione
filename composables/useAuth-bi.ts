export const useAuth = () => {
  const user = useState('user', () => null as any)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    user.value = {
      id: 1,
      name: 'Dr. Mario Rossi',
      email,
      studio: 'Smiledoc - Monterotondo'
    }

    if (process.client) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }

    return user.value
  }

  const register = async (data: any) => {
    // Mock registration - replace with actual API call
    user.value = {
      id: 1,
      name: data.name,
      email: data.email,
      studio: data.studio
    }

    if (process.client) {
      localStorage.setItem('user', JSON.stringify(user.value))
    }

    return user.value
  }

  const logout = () => {
    user.value = null
    if (process.client) {
      localStorage.removeItem('user')
    }
  }

  const checkAuth = () => {
    if (process.client) {
      const stored = localStorage.getItem('user')
      if (stored) {
        user.value = JSON.parse(stored)
      }
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
}
