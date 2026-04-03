import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-6 px-4">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-600">
        <p>
          Copyright © 2026{' '}
          <a
            href="https://1cplatform.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            1cPlatform
          </a>
          . Developed by{' '}
          <a
            href="https://sufikhan.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:underline"
          >
            Sufi K Sulaiman
          </a>
          . All rights reserved.
        </p>
      </div>
    </footer>
  );
}