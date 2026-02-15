export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, checkAuth } = useAuth()

  // Check auth state from localStorage
  checkAuth()

  if (!isAuthenticated.value) {
    return navigateTo('/login')
  }
})
