/**
 * Utility per determinare l'API base URL in base al dominio corrente
 *
 * Mapping:
 * - test.geniusmile.com / staging.geniusmile.com -> api-test.geniusmile.com (DB test)
 * - app.geniusmile.com / localhost -> api.geniusmile.com (DB production)
 */
export const getApiBaseFromDomain = (configApiBase: string): string => {
  if (typeof window === 'undefined') {
    return configApiBase // SSR fallback
  }

  const hostname = window.location.hostname

  // Test e Staging usano api-test
  if (hostname === 'test.geniusmile.com' || hostname === 'staging.geniusmile.com') {
    return 'https://api-test.geniusmile.com/api/v1'
  }

  // Production e localhost usano api (default from config)
  return configApiBase
}

/**
 * Determina l'environment corrente basandosi sul dominio
 */
export const getAppEnvFromDomain = (): 'production' | 'staging' | 'test' | 'development' => {
  if (typeof window === 'undefined') {
    return 'development'
  }

  const hostname = window.location.hostname

  if (hostname === 'app.geniusmile.com') {
    return 'production'
  }
  if (hostname === 'staging.geniusmile.com') {
    return 'staging'
  }
  if (hostname === 'test.geniusmile.com') {
    return 'test'
  }
  return 'development'
}
