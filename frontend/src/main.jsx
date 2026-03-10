import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './features/authContext.jsx'
import "./styles/index.scss";

createRoot(document.getElementById('root')).render(
<AuthProvider>
  <App />
</AuthProvider>
)
