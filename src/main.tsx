import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './design-system';
import './styles/global.css';
import { App } from './App';

const container = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Em produção o HTML vem pré-renderizado (scripts/prerender.mjs) e é apenas hidratado.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
