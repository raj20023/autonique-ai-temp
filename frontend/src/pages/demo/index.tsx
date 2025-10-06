import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Video, ExternalLink, ArrowLeft, Clock, Eye } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import AutoMascot from '@/components/ui/AutoMascot';

const DemoPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const demoVideos = [
    {
      id: 'main-demo',
      title: 'AutoniqueAI Complete Demo',
      description: 'Complete walkthrough of AutoniqueAI features, setup, and Instagram automation capabilities',
      youtubeId: 'qxhFyY_hGF8',
      duration: '15:30',
      views: '1.2K',
      category: 'Complete Demo',
      thumbnail: `https://img.youtube.com/vi/qxhFyY_hGF8/maxresdefault.jpg`
    },
    {
      id: 'mobile-demo',
      title: 'AutoniqueAI Mobile View',
      description: 'See how AutoniqueAI looks and works perfectly on mobile devices with responsive design',
      youtubeId: 'f7gC1Qog-Dc',
      duration: '1:00',
      views: 'New',
      category: 'Mobile Demo',
      thumbnail: `https://img.youtube.com/vi/f7gC1Qog-Dc/maxresdefault.jpg`
    }
  ];

  const guides = [
    {
      id: 'setup-guide',
      title: 'Complete Setup Guide',
      description: 'Step-by-step tutorial to set up AutoniqueAI for Instagram automation in 15 minutes',
      type: 'Written Guide',
      readTime: '15 min read',
      status: 'Available',
      url: '/blog/setup-guide'
    },
    {
      id: 'instagram-leads-lost',
      title: 'Why 80% of Instagram Leads Are Lost in the DMs',
      description: 'Learn why businesses lose leads in Instagram DMs and how AutoniqueAI helps capture every opportunity, 24/7',
      type: 'Written Guide',
      readTime: '8 min read',
      status: 'Available',
      url: '/blog/instagram-leads-lost'
    },
    {
      id: 'psychology-fast-replies',
      title: 'The Psychology of Fast Replies',
      description: 'Discover the psychological triggers behind fast replies and how instant responses build trust and convert more customers',
      type: 'Written Guide',
      readTime: '7 min read',
      status: 'Available',
      url: '/blog/psychology-fast-replies'
    },
    {
      id: 'faq-guide',
      title: 'Creating Effective FAQs',
      description: 'Best practices for creating FAQs that improve customer satisfaction',
      type: 'Written Guide',
      readTime: '8 min read',
      status: 'Coming Soon'
    },
    {
      id: 'automation-guide',
      title: 'Advanced Automation Tips',
      description: 'Maximize your Instagram automation with these expert tips',
      type: 'Written Guide',
      readTime: '12 min read',
      status: 'Coming Soon'
    }
  ];

  const openVideo = (youtubeId: string) => {
    setSelectedVideo(youtubeId);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <Head>
        <title>Demo & Guides - AutoniqueAI | Instagram Automation Tutorials</title>
        <meta name="description" content="Watch AutoniqueAI demos and read our comprehensive setup guides to automate your Instagram customer service with AI-powered responses." />
        <meta name="keywords" content="AutoniqueAI demo, Instagram automation guide, Instagram chatbot setup, social media automation tutorial" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Header */}
        <motion.header 
          className="relative z-10 px-6 py-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 text-white hover:text-purple-200 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <AutoMascot expression="hello" size="sm" />
              <h1 className="text-2xl font-bold text-white">Demo & Guides</h1>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20">
          
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
              See AutoniqueAI in
              <span className="block text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                Action
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Watch our comprehensive demos and read our detailed setup guides to transform your Instagram customer service with AI automation
            </p>
          </motion.div>

          {/* Demo Videos Section */}
          <motion.section 
            className="mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <Video className="h-8 w-8 text-purple-400" />
              <h3 className="text-3xl font-bold text-white">Demo Videos</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {demoVideos.map((video) => (
                <motion.div
                  key={video.id}
                  className="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 hover:border-purple-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-600 to-pink-600">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                      <motion.button
                        onClick={() => openVideo(video.youtubeId)}
                        className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-purple-600 hover:bg-white hover:scale-110 transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Play className="h-6 w-6 ml-1" fill="currentColor" />
                      </motion.button>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-purple-500/90 text-white text-sm font-medium rounded-full">
                        {video.category}
                      </span>
                    </div>

                    {/* Video Stats */}
                    <div className="absolute bottom-4 right-4 flex items-center space-x-3 text-white text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{video.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{video.views}</span>
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-white/70 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Guides Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="flex items-center space-x-3 mb-8">
              <BookOpen className="h-8 w-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white">Setup Guides & Tutorials</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <motion.div
                  key={guide.id}
                  className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20 hover:border-cyan-400/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-cyan-400" />
                      <span className="text-cyan-400 text-sm font-medium">{guide.type}</span>
                    </div>
                    {guide.status === 'Coming Soon' ? (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs font-medium rounded-full">
                        Coming Soon
                      </span>
                    ) : guide.status === 'Available' ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs font-medium rounded-full">
                        Available
                      </span>
                    ) : (
                      <ExternalLink className="h-4 w-4 text-white/60" />
                    )}
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">
                    {guide.title}
                  </h4>
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">
                    {guide.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{guide.readTime}</span>
                    {guide.status === 'Coming Soon' ? (
                      <motion.button
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-500/20 text-gray-400 cursor-not-allowed transition-all duration-300"
                        disabled
                      >
                        Coming Soon
                      </motion.button>
                    ) : (
                      <Link href={guide.url || '#'}>
                        <motion.button
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Read Guide
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeVideo}
          >
            <motion.div
              className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeVideo}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
              >
                ×
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                title="Demo Video"
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default DemoPage;
