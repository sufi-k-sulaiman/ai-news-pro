import React, { useEffect } from 'react';
import PageLayout from './components/PageLayout';
import { LOGO_URL } from './components/NavigationConfig';

export default function Layout({ children, currentPageName }) {
  useEffect(() => {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = LOGO_URL;
  }, []);

  return (
    <PageLayout activePage={currentPageName}>
      {children}
    </PageLayout>
  );
}