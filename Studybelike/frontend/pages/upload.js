import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

const subjects = ['Electronics', 'Arduino', 'Sensors', 'IoT', 'Computer Science', 'Programming', 'School Subjects'];
const courseCategories = ['Programming', 'Electronics', 'Arduino', 'Computer Science', 'Data Science', 'Web Development', 'Mobile Development'];
const courseLevels = ['Beginner', 'Intermediate', 'Advanced'];

export default function Upload() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('article');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [articleForm, setArticleForm] = useState({ title: '', slug: '', subject: '', content: '', author: '' });
  const [noteForm, setNoteForm] = useState({ title: '', subject: '', description: '', pdf_link: '' });
  const [courseForm, setCourseForm] = useState({ title: '', slug: '', description: '', category: '', price: 0, level: 'Beginner', duration: '', instructor: '', thumbnail: '' });
  const [courseContent, setCourseContent] = useState([{ title: '', description: '', videoUrl: '', duration: '' }]);
  const [paymentForm, setPaymentForm] = useState({ upiId: '', qrCodeImage: '', paypalClientId: '', courseAccessPrice: 99, accountName: '', accountNumber: '', bankName: '', ifscCode: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { router.push('/login'); return; }
    const userData = JSON.parse(savedUser);
    setUser(userData);
    if (userData.role !== 'admin') { router.push('/'); return; }
    setArticleForm(prev => ({ ...prev, author: userData.name }));
    setCourseForm(prev => ({ ...prev, instructor: userData.name }));
  }, []);

  const generateSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleArticleChange = (e) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({ ...prev, [name]: value, ...(name === 'title' ? { slug: generateSlug(value) } : {}) }));
  };

  const handleNoteChange = (e) => setNoteForm({ ...noteForm, [e.target.name]: e.target.value });

  const handleCourseChange = (e) => {
    const { name, value } = e.target;
    setCourseForm(prev => ({ ...prev, [name]: value, ...(name === 'title' ? { slug: generateSlug(value) } : {}) }));
  };

  const handleCourseContentChange = (index, field, value) => {
    const newContent = [...courseContent];
    newContent[index][field] = value;
    setCourseContent(newContent);
  };

  const addCourseContent = () => setCourseContent([...courseContent, { title: '', description: '', videoUrl: '', duration: '' }]);
  const removeCourseContent = (index) => setCourseContent(courseContent.filter((_, i) => i !== index));

  const handlePaymentChange = (e) => setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value });

  const handleQRCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentForm(prev => ({ ...prev, qrCodeImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(articleForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSuccess('Article created!');
      setArticleForm({ title: '', slug: '', subject: '', content: '', author: user?.name || '' });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleNoteSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(noteForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSuccess('Note created!');
      setNoteForm({ title: '', subject: '', description: '', pdf_link: '' });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const courseData = { ...courseForm, content: courseContent };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(courseData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSuccess('Course created!');
      setCourseForm({ title: '', slug: '', description: '', category: '', price: 0, level: 'Beginner', duration: '', instructor: user?.name || '', thumbnail: '' });
      setCourseContent([{ title: '', description: '', videoUrl: '', duration: '' }]);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(paymentForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setSuccess('Payment settings updated!');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <>
      <Head><title>Upload - StudyBeLike</title></Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link href="/">Home</Link><span>/</span><span className="text-gray-900 dark:text-white">Upload</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Upload Content</h1>
          {error && <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">{error}</div>}
          {success && <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">{success}</div>}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            {['article', 'note', 'course', 'payment'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-medium ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'article' && (
            <form onSubmit={handleArticleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Create Article</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" name="title" value={articleForm.title} onChange={handleArticleChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Slug</label><input type="text" name="slug" value={articleForm.slug} onChange={handleArticleChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Subject</label><select name="subject" value={articleForm.subject} onChange={handleArticleChange} required className="w-full px-4 py-3 border rounded-lg"><option value="">Select</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">Author</label><input type="text" name="author" value={articleForm.author} onChange={handleArticleChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
              </div>
              <div className="mt-6"><label className="block text-sm font-medium mb-2">Content (Markdown)</label><textarea name="content" value={articleForm.content} onChange={handleArticleChange} required rows={15} className="w-full px-4 py-3 border rounded-lg font-mono" /></div>
              <button type="submit" disabled={loading} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">{loading ? 'Creating...' : 'Create Article'}</button>
            </form>
          )}

          {activeTab === 'note' && (
            <form onSubmit={handleNoteSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Upload Note</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" name="title" value={noteForm.title} onChange={handleNoteChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Subject</label><select name="subject" value={noteForm.subject} onChange={handleNoteChange} required className="w-full px-4 py-3 border rounded-lg"><option value="">Select</option>{subjects.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              </div>
              <div className="mt-6"><label className="block text-sm font-medium mb-2">Description</label><textarea name="description" value={noteForm.description} onChange={handleNoteChange} required rows={3} className="w-full px-4 py-3 border rounded-lg" /></div>
              <div className="mt-6"><label className="block text-sm font-medium mb-2">PDF Link</label><input type="url" name="pdf_link" value={noteForm.pdf_link} onChange={handleNoteChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
              <button type="submit" disabled={loading} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold">{loading ? 'Uploading...' : 'Upload Note'}</button>
            </form>
          )}

          {activeTab === 'course' && (
            <form onSubmit={handleCourseSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Create Course</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-2">Title</label><input type="text" name="title" value={courseForm.title} onChange={handleCourseChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Slug</label><input type="text" name="slug" value={courseForm.slug} onChange={handleCourseChange} required className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Category</label><select name="category" value={courseForm.category} onChange={handleCourseChange} required className="w-full px-4 py-3 border rounded-lg"><option value="">Select</option>{courseCategories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">Level</label><select name="level" value={courseForm.level} onChange={handleCourseChange} className="w-full px-4 py-3 border rounded-lg">{courseLevels.map(l => <option key={l} value={l}>{l}</option>)}</select></div>
                <div><label className="block text-sm font-medium mb-2">Price (₹)</label><input type="number" name="price" value={courseForm.price} onChange={handleCourseChange} min="0" className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Duration</label><input type="text" name="duration" value={courseForm.duration} onChange={handleCourseChange} placeholder="e.g., 10 hours" className="w-full px-4 py-3 border rounded-lg" /></div>
              </div>
              <div className="mt-6"><label className="block text-sm font-medium mb-2">Description</label><textarea name="description" value={courseForm.description} onChange={handleCourseChange} required rows={4} className="w-full px-4 py-3 border rounded-lg" /></div>
              <div className="mt-6 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Course Content</h3>
                {courseContent.map((content, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between mb-2"><span>Lesson {index + 1}</span>{courseContent.length > 1 && <button type="button" onClick={() => removeCourseContent(index)} className="text-red-600">Remove</button>}</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Title" value={content.title} onChange={(e) => handleCourseContentChange(index, 'title', e.target.value)} className="px-3 py-2 border rounded-lg" />
                      <input type="text" placeholder="Video URL" value={content.videoUrl} onChange={(e) => handleCourseContentChange(index, 'videoUrl', e.target.value)} className="px-3 py-2 border rounded-lg" />
                      <input type="text" placeholder="Duration" value={content.duration} onChange={(e) => handleCourseContentChange(index, 'duration', e.target.value)} className="px-3 py-2 border rounded-lg" />
                      <input type="text" placeholder="Description" value={content.description} onChange={(e) => handleCourseContentChange(index, 'description', e.target.value)} className="px-3 py-2 border rounded-lg" />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addCourseContent} className="mt-2 px-4 py-2 bg-gray-200 rounded-lg">+ Add Lesson</button>
              </div>
              <button type="submit" disabled={loading} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold">{loading ? 'Creating...' : 'Create Course'}</button>
            </form>
          )}

          {activeTab === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Payment Settings</h2>
              <div className="mb-6"><label className="block text-sm font-medium mb-2">Upload QR Code</label><input type="file" accept="image/*" onChange={handleQRCodeUpload} className="w-full px-4 py-3 border rounded-lg" />{paymentForm.qrCodeImage && <img src={paymentForm.qrCodeImage} alt="QR" className="mt-2 max-w-xs" />}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-2">UPI ID</label><input type="text" name="upiId" value={paymentForm.upiId} onChange={handlePaymentChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Price (₹)</label><input type="number" name="courseAccessPrice" value={paymentForm.courseAccessPrice} onChange={handlePaymentChange} min="0" className="w-full px-4 py-3 border rounded-lg" /></div>
              </div>
              <h3 className="text-lg font-semibold mt-6 mb-4">Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium mb-2">Account Name</label><input type="text" name="accountName" value={paymentForm.accountName} onChange={handlePaymentChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Account Number</label><input type="text" name="accountNumber" value={paymentForm.accountNumber} onChange={handlePaymentChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">Bank Name</label><input type="text" name="bankName" value={paymentForm.bankName} onChange={handlePaymentChange} className="w-full px-4 py-3 border rounded-lg" /></div>
                <div><label className="block text-sm font-medium mb-2">IFSC Code</label><input type="text" name="ifscCode" value={paymentForm.ifscCode} onChange={handlePaymentChange} className="w-full px-4 py-3 border rounded-lg" /></div>
              </div>
              <h3 className="text-lg font-semibold mt-6 mb-4">Paypal</h3>
              <div><label className="block text-sm font-medium mb-2">Client ID</label><input type="text" name="paypalClientId" value={paymentForm.paypalClientId} onChange={handlePaymentChange} className="w-full px-4 py-3 border rounded-lg" /></div>
              <button type="submit" disabled={loading} className="mt-6 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold">{loading ? 'Saving...' : 'Save Settings'}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

