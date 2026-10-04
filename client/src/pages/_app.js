import React, { useEffect } from 'react';
import '../styles/globals.css';
import Head from 'next/head';
import Router from 'next/router';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import ErrorBoundary from '../components/Common/ErrorBoundary';

export default function MyApp({ Component, pageProps }) {
  const { initAuth } = useAuthStore();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initAuth();
    initTheme();

    // Catch and gracefully handle cancelled route changes so they don't produce error toasts
    const handleRouteChangeError = (err) => {
      if (err?.cancelled) {
        // Navigation was cancelled by another route change, safely ignore
        return;
      }
    };

    Router.events.on('routeChangeError', handleRouteChangeError);
    return () => {
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [initAuth, initTheme]);

  return (
    <ErrorBoundary>
      <Head>
        <title>FoodPack AI - Intelligent Food Packaging Recommendation System (MoFPI)</title>
        <meta
          name="description"
          content="AI-Based Intelligent Food Packaging Material Recommendation System for Food Commodities developed for the Ministry of Food Processing Industries (MoFPI) Hackathon."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/index.css" />
      </Head>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
