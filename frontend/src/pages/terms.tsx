import Head from 'next/head';

export default function TermsPage() {
  return (
    <>
      <Head>
        <title>Terms of Service - Autonique.ai</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Autonique.ai, you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Description</h2>
              <p className="text-gray-700 mb-4">
                Autonique.ai is an automated customer service platform that helps businesses respond
                to Instagram direct messages using AI-powered FAQ matching and response generation.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Responsibilities</h2>
              <p className="text-gray-700 mb-4">You agree to:</p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Provide accurate information when creating your account</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service in compliance with Instagram's Terms of Service</li>
                <li>Not use the service for spam or unauthorized communications</li>
              </ul>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Availability</h2>
              <p className="text-gray-700 mb-4">
                We strive to maintain high availability but do not guarantee uninterrupted service. 
                We may perform maintenance that temporarily affects service availability.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                Autonique.ai shall not be liable for any indirect, incidental, special, consequential,
                or punitive damages resulting from your use of the service.
              </p>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at terms@autonique.ai
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
