'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-white font-bold text-xl">
            Leo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link href="#about" className="text-gray-300 hover:text-indigo-400 transition-colors">
              Hakkımda
            </Link>
            <Link href="#projects" className="text-gray-300 hover:text-indigo-400 transition-colors">
              Projelerim
            </Link>
            <Link href="#documents" className="text-gray-300 hover:text-indigo-400 transition-colors">
              Belgelerim
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-indigo-400 transition-colors">
              İletişim
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="#about"
                className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Hakkımda
              </Link>
              <Link
                href="#projects"
                className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Projelerim
              </Link>
              <Link
                href="#documents"
                className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Belgelerim
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-gray-300 hover:text-indigo-400 hover:bg-gray-700 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                İletişim
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 