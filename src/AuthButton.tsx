import { useEffect, useRef } from 'react'
import { useYVAuth } from '@youversion/platform-react-hooks'

export default function AuthButton() {
  const { auth, userInfo, signIn, signOut, processCallback } = useYVAuth()
  const handled = useRef(false)

  // After YouVersion redirects back with ?code=..., finish the login
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has('code') && !handled.current) {
      handled.current = true
      processCallback()
        .catch(console.error)
        .finally(() => window.history.replaceState({}, '', import.meta.env.BASE_URL))
    }
  }, [])

  if (auth.isAuthenticated && userInfo) {
    const avatar = userInfo.getAvatarUrl(80, 80)?.toString()
    return (
      <button
        onClick={signOut}
        title="Click to sign out"
        style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={userInfo.name || 'Profile'}
            style={{ width: 40, height: 40, borderRadius: '50%', display: 'block' }}
          />
        ) : (
          <span style={{
            width: 40, height: 40, borderRadius: '50%', background: '#888', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {(userInfo.name || '?')[0]}
          </span>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={() => signIn({ scopes: ['profile'], permissions: ['highlights'] })}
      disabled={auth.isLoading}
    >
      Sign in with YouVersion
    </button>
  )
}