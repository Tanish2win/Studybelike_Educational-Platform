import Link from 'next/link';

export default function ArticleCard({ article }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden card-hover">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {article.subject}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(article.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <Link href={`/article/${article.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {article.content.replace(/[#*`]/g, '').substring(0, 150)}...
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            By {article.author}
          </span>
          <Link 
            href={`/article/${article.slug}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            Read More →
          </Link>
        </div>
      </div>
    </div>
  );
}


