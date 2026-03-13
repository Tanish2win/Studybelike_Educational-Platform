import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';

const subjects = [
  { name: 'Electronics', icon: '⚡', color: 'bg-yellow-100 dark:bg-yellow-900' },
  { name: 'Arduino', icon: '🔧', color: 'bg-teal-100 dark:bg-teal-900' },
  { name: 'Sensors', icon: '📡', color: 'bg-blue-100 dark:bg-blue-900' },
  { name: 'IoT', icon: '🌐', color: 'bg-purple-100 dark:bg-purple-900' },
  { name: 'Computer Science', icon: '💻', color: 'bg-green-100 dark:bg-green-900' },
  { name: 'Programming', icon: '⌨️', color: 'bg-red-100 dark:bg-red-900' },
  { name: 'School Subjects', icon: '📚', color: 'bg-orange-100 dark:bg-orange-900' },
];

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch articles
        const articlesRes = await fetch('/api/articles');
        const articlesData = await articlesRes.json();
        setArticles(articlesData.slice(0, 6));

        // Fetch notes
        const notesRes = await fetch('/api/notes');
        const notesData = await notesRes.json();
        setNotes(notesData.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>StudyBeLike - Engineering & School Study Materials</title>
        <meta name="description" content="Free engineering and school study materials including notes, tutorials, PDFs and videos." />
        <meta name="keywords" content="engineering, study materials, notes, tutorials, electronics, arduino, programming" />
        <meta property="og:title" content="StudyBeLike - Engineering & School Study Materials" />
        <meta property="og:description" content="Your one-stop destination for engineering and school study materials." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              Learn Engineering & <span className="text-blue-600 dark:text-blue-400">School Subjects</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
              Your one-stop destination for free engineering and school study materials. 
              Access notes, tutorials, PDFs, and videos.
            </p>
            
            {/* Search Bar */}
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Subjects */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Popular Subjects
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                href={`/subjects?subject=${subject.name.toLowerCase().replace(' ', '-')}`}
                className="flex flex-col items-center p-4 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 ${subject.color} rounded-full flex items-center justify-center text-3xl mb-3`}>
                  {subject.icon}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {subject.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Notes */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Latest Notes
            </h2>
            <Link href="/notes" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-48 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {notes.map((note) => (
                <div key={note._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 card-hover">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                    {note.subject}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {note.description}
                  </p>
                  <a
                    href={note.pdf_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Tutorials */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Featured Tutorials
            </h2>
            <Link href="/subjects" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* YouTube Videos Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Video Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Arduino Basics</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Learn Arduino from scratch</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Sensor Interfacing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Connect sensors to microcontrollers</p>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
              <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Data Structures</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Essential concepts for programming</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Learning Today
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and engineers who are already learning with StudyBeLike. 
            Sign up now to access all materials and upload your own notes.
          </p>
          <Link
            href="/login"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </>
  );
}


