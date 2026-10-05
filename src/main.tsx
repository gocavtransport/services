import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { FontSizeProvider } from './context/FontSizeContext';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker immediately for installability & offline caching
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('New GoCav update available');
  },
  onOfflineReady() {
    console.log('GoCav ready to work offline');
  },
});

createRoot(document.getElementById('root')!).render(
  <FontSizeProvider>
    <App />
  </FontSizeProvider>
);
