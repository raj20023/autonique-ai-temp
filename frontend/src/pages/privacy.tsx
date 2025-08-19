import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>Privacy Policy - AutoniqueAI</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                AutoniqueAI collects information you provide directly to us, such as when you create an account,
                connect your Instagram Business account, or contact us for support.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Provide and maintain our service</li>
                <li>Process Instagram messages and generate automated responses</li>
                <li>Improve our AI-powered FAQ matching system</li>
                <li>Communicate with you about your account</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Instagram Data</h2>
              <p className="text-gray-700 mb-4">
                We only access Instagram data necessary to provide our service, including messages sent to 
                your Instagram Business account. We do not store or share your Instagram content beyond 
                what is necessary for the service.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at autonique.ai@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
