import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Payment() {
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [transactionId, setTransactionId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchPaymentSettings();
  }, []);

  const fetchPaymentSettings = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment`);
      const data = await res.json();
      setPaymentSettings(data);
    } catch (error) {
      console.error('Error fetching payment settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>Payment - StudyBeLike</title>
        <meta name="description" content="Get access to all premium courses" />
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Access to All Premium Courses
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            One payment unlocks unlimited access to all our video courses
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white mb-8 text-center">
          <p className="text-blue-100 mb-2">Limited Time Offer</p>
          <div className="text-5xl font-bold mb-2">
            ₹{paymentSettings?.courseAccessPrice || 99}
          </div>
          <p className="text-blue-100">One-time payment, lifetime access</p>
        </div>

        {submitted ? (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-600 rounded-lg p-6 text-center">
            <svg className="w-16 h-16 mx-auto text-green-600 dark:text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Payment Submitted!</h2>
            <p className="text-green-700 dark:text-green-300">
              Your payment is being verified. You will receive access within 24-48 hours.
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Choose Payment Method
            </h2>

            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <span className="block text-lg font-semibold text-gray-900 dark:text-white">UPI / QR</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Scan & Pay</span>
              </button>
              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${paymentMethod === 'paypal' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <span className="block text-lg font-semibold text-gray-900 dark:text-white">Paypal</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">International</span>
              </button>
              <button
                onClick={() => setPaymentMethod('bank')}
                className={`flex-1 py-3 px-4 rounded-lg border-2 transition ${paymentMethod === 'bank' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900' : 'border-gray-300 dark:border-gray-600'}`}
              >
                <span className="block text-lg font-semibold text-gray-900 dark:text-white">Bank Transfer</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">NEFT/IMPS</span>
              </button>
            </div>

            {paymentMethod === 'upi' && (
              <div className="space-y-6">
                {paymentSettings?.qrCodeImage ? (
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Scan QR to pay</p>
                    <img src={paymentSettings.qrCodeImage} alt="QR" className="max-w-xs mx-auto rounded-lg" />
                  </div>
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                    <p className="text-gray-500">QR code not available</p>
                  </div>
                )}

                {paymentSettings?.upiId && (
                  <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">Or pay to UPI ID:</p>
                    <p className="text-xl font-mono font-bold text-blue-600">{paymentSettings.upiId}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Transaction ID / UTR Number
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                      placeholder="Enter transaction ID"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
                    Submit Payment
                  </button>
                </form>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="space-y-6">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-500">Paypal integration coming soon</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Paypal Email</label>
                    <input type="email" required placeholder="your@email.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold">Proceed with Paypal</button>
                </form>
              </div>
            )}

            {paymentMethod === 'bank' && (
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
                  {paymentSettings?.bankDetails ? (
                    <div className="space-y-2">
                      <p><span className="font-medium">Account Name:</span> {paymentSettings.bankDetails.accountName}</p>
                      <p><span className="font-medium">Bank:</span> {paymentSettings.bankDetails.bankName}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Bank details not available</p>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Reference</label>
                    <input type="text" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} required placeholder="Enter reference" className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold">Submit</button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

