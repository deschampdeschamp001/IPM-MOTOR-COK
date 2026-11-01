/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RouterProvider, useRouter, matchPath } from './router/Router';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { ScrollToTop } from './components/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ModelsPage } from './pages/ModelsPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { OffersPage } from './pages/OffersPage';
import { AfterSalesPage } from './pages/AfterSalesPage';
import { AboutPage } from './pages/AboutPage';
import { NewsPage } from './pages/NewsPage';
import { NewsArticlePage } from './pages/NewsArticlePage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { VehiclesHubPage } from './pages/VehiclesHubPage';

function AppRouter() {
  const { pathname } = useRouter();

  // Admin route has its own full-screen layout
  if (pathname === '/admin') {
    return <AdminPage />;
  }

  // Route matching
  let PageComponent = HomePage;

  if (pathname === '/') {
    PageComponent = HomePage;
  } else if (pathname === '/vehicules') {
    PageComponent = VehiclesHubPage;
  } else if (pathname === '/modeles' || pathname === '/marques' || matchPath('/marques/:slug', pathname).matches) {
    PageComponent = ModelsPage;
  } else if (matchPath('/vehicule/:id', pathname).matches) {
    PageComponent = VehicleDetailPage;
  } else if (pathname === '/offres') {
    PageComponent = OffersPage;
  } else if (pathname === '/apres-vente') {
    PageComponent = AfterSalesPage;
  } else if (pathname === '/a-propos' || pathname === '/contact') {
    PageComponent = ContactPage;
  } else if (pathname === '/actualites') {
    PageComponent = NewsPage;
  } else if (matchPath('/actualites/:slug', pathname).matches) {
    PageComponent = NewsArticlePage;
  } else {
    // Fallback to home
    PageComponent = HomePage;
  }

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-[var(--bg)] text-[var(--fg)] transition-colors duration-200">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <PageComponent />
      </main>
      <Footer />
      <ScrollToTop />
      <FloatingWhatsApp />
      <MobileBottomNav />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <DataProvider>
          <AppRouter />
        </DataProvider>
      </RouterProvider>
    </ThemeProvider>
  );
}

export default App;
