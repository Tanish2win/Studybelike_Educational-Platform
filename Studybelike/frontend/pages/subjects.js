import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ArticleCard from '../components/ArticleCard';

const subjectsList = [
  { name: 'Electronics', icon: '⚡', color: 'bg-yellow-100 dark:bg-yellow-900', description: 'Learn about circuits, components, and electronic systems' },
  { name: 'Arduino', icon: '🔧', color: 'bg-teal-100 dark:bg-teal-900', description: 'Microcontroller programming and projects' },
  { name: 'Sensors', icon: '📡', color: 'bg-blue-100 dark:bg-blue-900', description: 'Various sensors and their applications' },
  { name: 'IoT', icon: '🌐', color: 'bg-purple-100 dark:bg-purple-900', description: 'Internet of Things concepts and projects' },
  { name: 'Computer Science', icon: '💻', color: 'bg-green-100 dark:bg-green-900', description: 'Data structures, algorithms, and CS fundamentals' },
  { name: 'Programming', icon: '⌨️', color: 'bg-red-100 dark:bg-red-900', description: 'Learn various programming languages' },
  { name: 'School Subjects', icon: '📚', color: 'bg-orange-100 dark:bg-orange-900', description: 'School-level study materials' },
];

export default function Subjects() {
  const router = useRouter();
  const { subject } = router.query;
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(subject || '');

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const url = selectedSubject 
          ? `/api/articles?subject=${encodeURIComponent(selectedSubject)}`
          : '/api/articles';
        const res = await fetch(url);
        const data = await res.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedSubject]);

  const handleSubjectClick = (subjectName) => {
    setSelectedSubject(subjectName === selectedSubject ? '' : subjectName);
  };

  return (
    <>
      <Head>
        <title>Subjects - StudyBeLike</title>
        <meta name="description" content="Browse subjects for engineering and school study materials" />
      </Head>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">Subjects</span>
          </nav>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            Browse by Subject
          </h1>

          {/* Subject Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
            {subjectsList.map((subj) => (
              <button
                key={subj.name}
                onClick={() => handleSubjectClick(subj.name)}
                className={`p-6 rounded-xl text-left transition-all ${
                  selectedSubject === subj.name
                    ? 'ring-2 ring-blue-500 shadow-lg'
                    : 'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg'
                }`}
              >
                <div className={`w-14 h-14 ${subj.color} rounded-lg flex items-center justify-center text-2xl mb-4`}>
                  {subj.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {subj.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {subj.description}
                </p>
              </button>
            ))}
          </div>

          {/* Articles Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedSubject ? `${selectedSubject} Tutorials` : 'All Tutorials'}
              {articles.length > 0 && <span className="text-lg font-normal text-gray-500 ml-2">({articles.length})</span>}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No tutorials found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try selecting a different subject or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}


