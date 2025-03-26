import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import "./assets/style/tailwind.css"
import AppRouter from "./router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AppRouter/>
  </StrictMode>,
)
