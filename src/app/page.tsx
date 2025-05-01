'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  date: string;
}

interface Document {
  id: number;
  title: string;
  type: string;
  file: string;
  date: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data); // Debug için
        setProjects(data.projects || []);
        setDocuments(data.documents || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="text-center text-white z-10">
          <h1 className="text-5xl font-bold mb-4">Hoş Geldiniz</h1>
          <p className="text-xl mb-8">Yazılım Geliştirici & Proje Yöneticisi</p>
          <Link 
            href="#about" 
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all"
          >
            Hakkımda
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Hakkımda</h2>
          <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="md:w-1/2">
              <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/profile.jpg"
                  alt="Leo'nun Profil Fotoğrafı"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="md:w-1/2 text-gray-300">
              <h3 className="text-2xl font-semibold mb-4 text-white">Merhaba, Ben Leo</h3>
              <p className="mb-4">
                Yazılım geliştirme dünyasında kendini sürekli geliştirmeyi hedefleyen bir yazılım mühendisiyim. Ağırlıklı olarak web teknolojileriyle ilgileniyor, front-end ve back-end tarafında projeler geliştiriyorum.
              </p>
              <p className="mb-4">
                HTML, CSS, JavaScript, React ve Node.js gibi teknolojilerle aktif olarak çalışıyor; aynı zamanda API entegrasyonları, veritabanı yönetimi ve performans optimizasyonu gibi konulara da odaklanıyorum.
              </p>
              <p className="mb-4">
                Bu site, hem yaptığım projeleri sergilemek hem de öğrendiklerimi paylaşmak amacıyla oluşturduğum kişisel alanım. Yazılım, üretkenlik ve dijital dünya üzerine paylaşımlarla burada olacağım.
              </p>
              <div className="flex gap-4 mt-6">
                <Link 
                  href="#projects"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-all"
                >
                  Projelerimi Gör
                </Link>
                <Link 
                  href="#contact"
                  className="border border-indigo-500 text-indigo-400 px-6 py-2 rounded-md hover:bg-indigo-900 transition-all"
                >
                  İletişime Geç
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Projelerim</h2>
          {projects.length === 0 ? (
            <p className="text-gray-400 text-center">Henüz proje eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-300 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-900 text-indigo-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Documents Section */}
      <section id="documents" className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Belgelerim</h2>
          {documents.length === 0 ? (
            <p className="text-gray-400 text-center">Henüz belge eklenmemiş.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                      <p className="text-gray-400">{doc.type}</p>
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block"
                      >
                        Belgeyi Görüntüle
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">İletişim</h2>
          <div className="max-w-xl mx-auto">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
} 