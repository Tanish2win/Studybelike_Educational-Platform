import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import SearchBar from '../components/SearchBar';

const subjects = ['All', 'Electronics', 'Arduino', 'Sensors', 'IoT', 'Computer Science', 'Programming', 'School Subjects'];

export default function Notes() {
  const router = useRouter();
  const { search, subject } = router.query;
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(subject || 'All');

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        let url = '/api/notes';
        const params = [];
        
        if (selectedSubject && selectedSubject !== 'All') {
          params.push(`subject=${encodeURIComponent(selectedSubject)}`);
        }
        if (search) {
          params.push(`search=${encodeURIComponent(search)}`);
        }
        
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
        
        const res = await fetch(url);
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [selectedSubject, search]);

  return (
    <>
      <Head>
        <title>Notes - StudyBeLike</title>
        <meta name="description" content="Download free study notes, PDFs, and educational materials" />
      </Head>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Notes</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Study Notes
          </h1>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar initialValue={search || ''} />
          </div>

          {/* Subject Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {subjects.map((subj) => (
              <button
                key={subj}
                onClick={() => setSelectedSubject(subj)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedSubject === subj
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700'
                }`}
              >
                {subj}
              </button>
            ))}
          </div>

          {/* Notes Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full">
                      {note.subject}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {note.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {note.description}
                  </p>
                  
                  <a
                    href={note.pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No notes found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


