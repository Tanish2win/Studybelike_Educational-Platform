import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function CourseDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [course, setCourse] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        const relatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses/related/${data.category}`);
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedCourses(relatedData.filter(c => c._id !== data._id));
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course not found</h1>
          <Link href="/courses" className="text-blue-600 hover:underline mt-4 inline-block">Back to Courses</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{course.title} - StudyBeLike</title>
        <meta name="description" content={course.description} />
      </Head>

      <Navbar />

      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500 dark:text-gray-400">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/courses" className="hover:text-blue-600">Courses</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 dark:text-white">{course.title}</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="h-64 md:h-80 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-24 h-24 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>

              <div className="p-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">{course.category}</span>
                  <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full">{course.level}</span>
                  {course.isPremium && <span className="px-3 py-1 text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 rounded-full">Premium</span>}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{course.title}</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{course.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{course.content?.length || 0}</p>
                    <p className="text-sm text-gray-500">Lessons</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{course.duration}</p>
                    <p className="text-sm text-gray-500">Duration</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{course.enrolledStudents}</p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{course.rating}</p>
                    <p className="text-sm text-gray-500">Rating</p>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Course Content</h2>
                <div className="space-y-3">
                  {course.content?.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mr-4">{index + 1}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                        {item.description && <p className="text-sm text-gray-500">{item.description}</p>}
                      </div>
                      {item.duration && <span className="text-sm text-gray-500">{item.duration}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-gray-500 dark:text-gray-400 mb-2">Course Price</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{course.price === 0 ? 'Free' : `₹${course.price}`}</p>
              </div>

              <Link href="/payment" className="block w-full py-3 bg-blue-600 text-white text-center rounded-lg font-semibold hover:bg-blue-700 transition mb-4">
                {course.price === 0 ? 'Enroll Now - Free' : 'Buy Now'}
              </Link>

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">This course includes:</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{course.content?.length || 0} video lessons</li>
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Lifetime access</li>
                  <li className="flex items-center"><svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Certificate of completion</li>
                </ul>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Instructor:</strong> {course.instructor}</p>
              </div>
            </div>
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Related Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCourses.map(related => (
                <Link key={related._id} href={`/courses/${related.slug}`} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{related.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{related.category}</p>
                    <p className="text-blue-600 font-bold mt-2">{related.price === 0 ? 'Free' : `₹${related.price}`}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

