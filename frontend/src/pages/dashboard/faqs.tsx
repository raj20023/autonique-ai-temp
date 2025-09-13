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
import { AutoFAQ, AutoLoader } from '@/components/ui/AutoMascot';
import { useAutoExpressions } from '@/contexts/AutoContext';

export default function FAQsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });
  const [isClient, setIsClient] = useState(false);
  const { showSuccess, showError } = useAutoExpressions();

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
        showSuccess(); // Show happy Auto
        queryClient.invalidateQueries('faqs');
        setNewFAQ({ question: '', answer: '' });
        setShowAddForm(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to add FAQ');
        showError(); // Show error Auto
      }
    }
  );

  const deleteFAQMutation = useMutation(
    (faqId: number) => faqApi.deleteFAQ(faqId),
    {
      onSuccess: () => {
        toast.success('FAQ deleted successfully!');
        showSuccess(); // Show happy Auto
        queryClient.invalidateQueries('faqs');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'Failed to delete FAQ');
        showError(); // Show error Auto
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
        <link rel="icon" href="https://autonique-ai.s3.ap-northeast-3.amazonaws.com/logos/favicon_auto.svg" type="image/svg+xml" />
      </Head>
      
      <DashboardLayout title="FAQ Management">
        {/* Gradient Background */}
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden -m-6 p-6">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <motion.div
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>

          <div className="relative z-10 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <AutoFAQ />
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-lg">FAQ Management</h1>
                  <p className="text-sm sm:text-base text-white/80 drop-shadow-md">Auto is ready to help manage your automated responses</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add FAQ
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/70">Total FAQs</p>
                    <p className="text-2xl font-bold text-white drop-shadow-lg">{activeFAQs.length}</p>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/70">Active</p>
                    <p className="text-2xl font-bold text-white drop-shadow-lg">{activeFAQs.length}</p>
                  </div>
                </div>
              </div>
              <div className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 shadow-2xl p-6 group hover:bg-white/15 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Upload className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-white/70">Ready to Use</p>
                    <p className="text-2xl font-bold text-white drop-shadow-lg">{activeFAQs.length > 0 ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add FAQ Form */}
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-xl bg-white/10 rounded-lg border border-white/20 shadow-2xl p-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4 drop-shadow-lg">Add New FAQ</h2>
                <form onSubmit={handleAddFAQ} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Question
                    </label>
                    <input
                      type="text"
                      value={newFAQ.question}
                      onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                      placeholder="What are your business hours?"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Answer
                    </label>
                    <textarea
                      value={newFAQ.answer}
                      onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                      placeholder="We're open Monday to Friday, 9 AM to 6 PM."
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/60 backdrop-blur-sm"
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={createFAQMutation.isLoading}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-300 shadow-lg"
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
                <div className="p-6 text-center text-gray-500">
                  <AutoLoader expression="sleepy" size="md" className="mx-auto mb-4" />
                  <p>Auto is loading your FAQs...</p>
                </div>
              ) : activeFAQs.length === 0 ? (
                <div className="p-6 text-center">
                  <AutoFAQ className="mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs yet</h3>
                  <p className="text-gray-600 mb-4">
                    Auto is ready to help! Add your first FAQ to start automating customer responses
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
        </div>
      </DashboardLayout>
    </>
  );
}
