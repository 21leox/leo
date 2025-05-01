'use client';

import React from 'react';

export default function ContactForm() {
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          alert('Mesajınız başarıyla gönderildi!');
          e.currentTarget.reset();
        } else {
          alert('Mesaj gönderilirken bir hata oluştu.');
        }
      } catch (error) {
        alert('Mesaj gönderilirken bir hata oluştu.');
      }
    }} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">İsim</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-posta</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">Mesaj</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 text-white focus:border-indigo-500 focus:ring-indigo-500"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition-all"
      >
        Gönder
      </button>
    </form>
  );
} 