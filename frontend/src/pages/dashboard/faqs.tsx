import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  Upload
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { faqApi } from '@/utils/api';
import { isAuthenticated } from '@/utils/auth';
import toast from 'react-hot-toast';
import { FAQ } from '@/types';

export default function FAQsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [isClient, setIsClient] = useState(false);

  // Always call hooks at the top level
  const { data: faqs, isLoading } = useQuery(
    'faqs',
    () => faqApi.getFAQs().then(res => res.data),
    { enabled: isClient }
  );

  const createFAQMutation = useMutation(
    (faqData: { question: string; answer: string }) => faqApi.createFAQ(faqData),
    {
      onSuccess: () => {
        toast.success('FAQ added successfully!');
        queryClient.invalidateQueries('faqs');
        setNewFAQ({ question: '', answer: '' });
        setShowAddForm(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to add FAQ');
      }
    }
  );

  const deleteFAQMutation = useMutation(
    (faqId: number) => faqApi.deleteFAQ(faqId),
    {
      onSuccess: () => {
        toast.success('FAQ deleted successfully!');
        queryClient.invalidateQueries('faqs');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to delete FAQ');
      }
    }
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isClient, router]);

  // Show loading state while client-side hydration happens
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading if not authenticated (will redirect)
  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFAQ.question.trim() && newFAQ.answer.trim()) {
      createFAQMutation.mutate(newFAQ);
    }
  };

  const activeFAQs = faqs?.filter(faq => faq.is_active) || [];

  return (
    <>
      <Head>
        <title>FAQs - AutoniqueAI</title>
      </Head>
      
      <DashboardLayout title="FAQ Management">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">FAQ Management</h1>
              <p className="text-gray-600">Manage your automated responses</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total FAQs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeFAQs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeFAQs.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <Upload className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ready to Use</p>
                  <p className="text-2xl font-bold text-gray-900">{activeFAQs.length > 0 ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Add FAQ Form */}
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New FAQ</h2>
              <form onSubmit={handleAddFAQ} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                  </label>
                  <input
                    type="text"
                    value={newFAQ.question}
                    onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                    placeholder="What are your business hours?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer
                  </label>
                  <textarea
                    value={newFAQ.answer}
                    onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                    placeholder="We're open Monday to Friday, 9 AM to 6 PM."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={createFAQMutation.isLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {createFAQMutation.isLoading ? 'Adding...' : 'Add FAQ'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* FAQs List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your FAQs</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {isLoading ? (
                <div className="p-6 text-center text-gray-500">Loading FAQs...</div>
              ) : activeFAQs.length === 0 ? (
                <div className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add your first FAQ to start automating customer responses
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First FAQ
                  </button>
                </div>
              ) : (
                activeFAQs.map((faq: FAQ) => (
                  <div key={faq.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 mb-3">{faq.answer}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Created: {new Date(faq.created_at).toLocaleDateString()}</span>
                          {faq.similarity_threshold && (
                            <span>Threshold: {(faq.similarity_threshold * 100).toFixed(0)}%</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => deleteFAQMutation.mutate(faq.id)}
                          disabled={deleteFAQMutation.isLoading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Start Guide */}
          {activeFAQs.length === 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Start Guide</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li>Add your most common customer questions and answers</li>
                <li>The AI will automatically match similar questions</li>
                <li>Test your FAQs using the dashboard</li>
                <li>Your Instagram will start auto-replying immediately!</li>
              </ol>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
