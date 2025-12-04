import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Use the base path for GitHub Pages deployment
const basename = import.meta.env.BASE_URL

// Handle GitHub Pages SPA redirect from 404.html
const params = new URLSearchParams(window.location.search)
const redirect = params.get('redirect')
if (redirect) {
  // Remove the redirect param and navigate to the actual path
  // Ensure no double slashes by removing trailing slash from basename if redirect starts with /
  const cleanBase = basename.endsWith('/') ? basename.slice(0, -1) : basename
  const cleanRedirect = redirect.startsWith('/') ? redirect : '/' + redirect
  window.history.replaceState(null, '', cleanBase + cleanRedirect)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
