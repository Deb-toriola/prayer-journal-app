import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { Capacitor } from '@capacitor/core';

// Native app initialisation — only runs inside Capacitor (iOS/Android)
if (Capacitor.isNativePlatform()) {
  // Transparent status bar so content bleeds under the notch naturally
  StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
  StatusBar.setBackgroundColor({ color: '#0A1628' }).catch(() => {});

  // Hide the splash screen once React has rendered
  SplashScreen.hide({ fadeOutDuration: 300 }).catch(() => {});
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
