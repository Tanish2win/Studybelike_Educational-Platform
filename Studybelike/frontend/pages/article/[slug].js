import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export default function ArticlePage() {
  const router = useRouter();
  const { slug } = router.query;
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/articles/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setArticle(data);
          setComments(data.comments || []);
          
          // Fetch related articles
          const relatedRes = await fetch(`/api/articles/related/${encodeURIComponent(data.subject)}`);
          const relatedData = await relatedRes.json();
          setRelatedArticles(relatedData.filter(a => a.slug !== slug).slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || !user) return;

    try {
      const res = await fetch(`/api/articles/${article._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user.name,
          text: comment,
        }),
      });

      if (res.ok) {
        const updatedComments = await res.json();
        setComments(updatedComments);
        setComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Article Not Found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} - StudyBeLike</title>
        <meta name="description" content={article.content.substring(0, 160)} />
        <meta name="keywords" content={`${article.subject}, ${article.title}, tutorial, study materials`} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
      </Head>

      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span>/</span>
            <Link href="/subjects" className="hover:text-blue-600 dark:hover:text-blue-400">Subjects</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-white">{article.subject}</span>
          </nav>

          {/* Article Header */}
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full">
                  {article.subject}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(article.created_at).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {article.title}
              </h1>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-8">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{article.author}</span>
              </div>

              {/* Article Content */}
              <div className="article-content">
                <ReactMarkdown
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Download PDF Button */}
              <div className="mt-8 pt-8 border-t dark:border-gray-700">
                <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download as PDF
                </button>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedArticles.map((related) => (
                  <Link
                    key={related._id}
                    href={`/article/${related.slug}`}
                    className="block p-4 border dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {related.title}
                    </h3>
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      {related.subject}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Comments ({comments.length})
            </h2>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-4 py-3 border dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <button
                  type="submit"
                  className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-600 dark:text-gray-300">
                  <Link href="/login" className="text-blue-600 hover:text-blue-700">Login</Link> to post a comment.
                </p>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length > 0 ? (
                comments.map((c, index) => (
                  <div key={index} className="border-b dark:border-gray-700 pb-6 last:border-0">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {c.user.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {c.user}
                        </span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(c.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 ml-12">
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


