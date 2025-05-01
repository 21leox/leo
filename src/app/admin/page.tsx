'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
}

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

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan oturum durumunu kontrol et
    const checkLoginStatus = () => {
      const loginStatus = localStorage.getItem('adminLoginStatus');
      if (loginStatus === 'true') {
        setIsLoggedIn(true);
        fetchData();
      }
    };

    checkLoginStatus();
  }, []);

  const fetchData = async () => {
    try {
      const [messagesRes, projectsRes, documentsRes] = await Promise.all([
        fetch('/api/admin'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/documents')
      ]);
      
      const messagesData = await messagesRes.json();
      const projectsData = await projectsRes.json();
      const documentsData = await documentsRes.json();
      
      setMessages(messagesData);
      setProjects(projectsData);
      setDocuments(documentsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        setIsLoggedIn(true);
        // Oturum durumunu localStorage'a kaydet
        localStorage.setItem('adminLoginStatus', 'true');
      } else {
        alert('Geçersiz kullanıcı adı veya şifre');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // Oturum durumunu localStorage'dan sil
    localStorage.removeItem('adminLoginStatus');
  };

  const markAsRead = async (id: number) => {
    try {
      await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      fetchData();
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          description: formData.get('description'),
          technologies: formData.get('technologies')?.toString().split(',').map(t => t.trim()),
          image: formData.get('image')
        }),
      });

      if (response.ok) {
        alert('Proje başarıyla eklendi');
        e.currentTarget.reset();
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add project:', error);
    }
  };

  const handleDocumentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/admin/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.get('title'),
          type: formData.get('type'),
          file: formData.get('file')
        }),
      });

      if (response.ok) {
        alert('Belge başarıyla eklendi');
        e.currentTarget.reset();
        fetchData();
      }
    } catch (error) {
      console.error('Failed to add document:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/projects/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Proje başarıyla silindi');
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Bu belgeyi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/admin/documents/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Belge başarıyla silindi');
          fetchData();
        }
      } catch (error) {
        console.error('Failed to delete document:', error);
      }
    }
  };

  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleViewDocument = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentModal(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-96">
          <h1 className="text-2xl font-bold text-white mb-6">Admin Girişi</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Kullanıcı Adı</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Şifre</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Paneli</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'messages'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Mesajlar
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'projects'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Projeler
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-md ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Belgeler
          </button>
        </div>

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="grid gap-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`bg-gray-800 p-6 rounded-lg shadow-lg ${
                  !message.read ? 'border-l-4 border-indigo-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{message.name}</h3>
                    <p className="text-gray-400">{message.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">
                      {new Date(message.date).toLocaleString('tr-TR')}
                    </p>
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                      >
                        Okundu Olarak İşaretle
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-300">{message.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            <form onSubmit={handleProjectSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Yeni Proje Ekle</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Proje Adı</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Açıklama</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Teknolojiler (virgülle ayırın)</label>
                  <input
                    type="text"
                    name="technologies"
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Görsel URL</label>
                  <input
                    type="text"
                    name="image"
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Proje Ekle
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-900 text-indigo-300 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewProject(project)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Görüntüle
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-8">
            <form onSubmit={handleDocumentSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Yeni Belge Ekle</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Belge Adı</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Belge Türü</label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="sertifika">Sertifika</option>
                    <option value="diploma">Diploma</option>
                    <option value="referans">Referans</option>
                    <option value="diğer">Diğer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Dosya URL</label>
                  <input
                    type="text"
                    name="file"
                    required
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Belge Ekle
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-gray-900 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-900 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{doc.title}</h3>
                      <p className="text-gray-400">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDocument(doc)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                      Görüntüle
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {showProjectModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedProject.title}</h2>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="relative h-64 mb-4">
              <Image
                src={selectedProject.image}
                alt={selectedProject.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <p className="text-gray-300 mb-4">{selectedProject.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProject.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-900 text-indigo-300 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Eklenme Tarihi: {new Date(selectedProject.date).toLocaleString('tr-TR')}
            </p>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedDocument.title}</h2>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-300 mb-2">Belge Türü</h3>
                <p className="text-white">{selectedDocument.type}</p>
              </div>
              <div>
                <h3 className="text-gray-300 mb-2">Dosya</h3>
                <a
                  href={selectedDocument.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {selectedDocument.file}
                </a>
              </div>
              <div>
                <h3 className="text-gray-300 mb-2">Eklenme Tarihi</h3>
                <p className="text-white">
                  {new Date(selectedDocument.date).toLocaleString('tr-TR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 