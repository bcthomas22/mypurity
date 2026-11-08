import { YouVersionProvider } from '@youversion/platform-react-hooks'
import { createRoot } from 'react-dom/client'
import './styling/index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <YouVersionProvider
    appKey={import.meta.env.VITE_YOUVERSION_APP_KEY}
    includeAuth={true}
    authRedirectUrl={`${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, '')}
  >
    <App />
  </YouVersionProvider>
)
