import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.jsx'

// Use the base path for GitHub Pages deployment
const basename = import.meta.env.BASE_URL

// Handle GitHub Pages SPA redirect from 404.html
const params = new URLSearchParams(window.location.search)
const redirect = params.get('redirect')
if (redirect) {
  // Get search params and hash as separate values (they're encoded separately in 404.html)
  const searchParam = params.get('search') || ''
  const hashParam = params.get('hash') || ''
  // Remove the redirect param and navigate to the actual path
  // Ensure no double slashes by removing trailing slash from basename if redirect starts with /
  const cleanBase = basename.endsWith('/') ? basename.slice(0, -1) : basename
  const cleanRedirect = redirect.startsWith('/') ? redirect : '/' + redirect
  window.history.replaceState(null, '', cleanBase + cleanRedirect + searchParam + hashParam)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={{
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
        defaults: '2025-05-24',
        capture_exceptions: true,
        debug: import.meta.env.MODE === 'development',
      }}
    >
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </PostHogProvider>
  </StrictMode>,
)
