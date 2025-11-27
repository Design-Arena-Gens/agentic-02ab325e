'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NetworkGraph from './components/NetworkGraph'
import ConversationPanel from './components/ConversationPanel'
import TopicsCloud from './components/TopicsCloud'

interface ConversationNode {
  id: string
  title: string
  timestamp: Date
  topics: string[]
  connections: string[]
  messages: number
  summary: string
}

const sampleData: ConversationNode[] = [
  {
    id: '1',
    title: 'AI Ethics Discussion',
    timestamp: new Date('2024-01-15'),
    topics: ['ethics', 'AI', 'philosophy'],
    connections: ['2', '4'],
    messages: 24,
    summary: 'Deep dive into ethical considerations in AI development'
  },
  {
    id: '2',
    title: 'Machine Learning Basics',
    timestamp: new Date('2024-01-16'),
    topics: ['machine learning', 'AI', 'programming'],
    connections: ['1', '3'],
    messages: 18,
    summary: 'Introduction to core ML concepts and algorithms'
  },
  {
    id: '3',
    title: 'Python Data Science',
    timestamp: new Date('2024-01-17'),
    topics: ['python', 'data science', 'programming'],
    connections: ['2', '5'],
    messages: 31,
    summary: 'Working with pandas, numpy, and visualization libraries'
  },
  {
    id: '4',
    title: 'Future of Technology',
    timestamp: new Date('2024-01-18'),
    topics: ['technology', 'future', 'AI'],
    connections: ['1', '6'],
    messages: 15,
    summary: 'Exploring emerging tech trends and predictions'
  },
  {
    id: '5',
    title: 'Neural Networks',
    timestamp: new Date('2024-01-19'),
    topics: ['neural networks', 'deep learning', 'AI'],
    connections: ['3', '7'],
    messages: 27,
    summary: 'Understanding backpropagation and network architectures'
  },
  {
    id: '6',
    title: 'Quantum Computing',
    timestamp: new Date('2024-01-20'),
    topics: ['quantum', 'computing', 'physics'],
    connections: ['4', '8'],
    messages: 22,
    summary: 'Introduction to quantum algorithms and qubits'
  },
  {
    id: '7',
    title: 'Computer Vision',
    timestamp: new Date('2024-01-21'),
    topics: ['computer vision', 'AI', 'deep learning'],
    connections: ['5', '9'],
    messages: 19,
    summary: 'CNNs and image recognition techniques'
  },
  {
    id: '8',
    title: 'Blockchain Technology',
    timestamp: new Date('2024-01-22'),
    topics: ['blockchain', 'cryptocurrency', 'technology'],
    connections: ['6'],
    messages: 16,
    summary: 'Decentralized systems and consensus mechanisms'
  },
  {
    id: '9',
    title: 'Natural Language Processing',
    timestamp: new Date('2024-01-23'),
    topics: ['NLP', 'AI', 'language'],
    connections: ['7', '10'],
    messages: 29,
    summary: 'Transformers, embeddings, and language models'
  },
  {
    id: '10',
    title: 'Reinforcement Learning',
    timestamp: new Date('2024-01-24'),
    topics: ['reinforcement learning', 'AI', 'robotics'],
    connections: ['9'],
    messages: 25,
    summary: 'Q-learning, policy gradients, and reward systems'
  }
]

export default function Home() {
  const [conversations] = useState<ConversationNode[]>(sampleData)
  const [selectedNode, setSelectedNode] = useState<ConversationNode | null>(null)
  const [viewMode, setViewMode] = useState<'network' | 'topics'>('network')
  const [searchTerm, setSearchTerm] = useState('')
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())) ||
    conv.summary.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const allTopics = Array.from(
    new Set(conversations.flatMap(c => c.topics))
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ChatGPT Atlas</h1>
                <p className="text-sm text-gray-400">Explore your AI conversations</p>
              </div>
            </motion.div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('network')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'network'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Network
                </button>
                <button
                  onClick={() => setViewMode('topics')}
                  className={`px-4 py-2 rounded-md transition-all ${
                    viewMode === 'topics'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Topics
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-4 gap-4 mb-6"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">{conversations.length}</div>
              <div className="text-sm text-gray-400">Conversations</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-purple-400">{allTopics.length}</div>
              <div className="text-sm text-gray-400">Topics</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-green-400">
                {conversations.reduce((sum, c) => sum + c.messages, 0)}
              </div>
              <div className="text-sm text-gray-400">Total Messages</div>
            </div>
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-orange-400">
                {conversations.reduce((sum, c) => sum + c.connections.length, 0)}
              </div>
              <div className="text-sm text-gray-400">Connections</div>
            </div>
          </motion.div>

          {/* Visualization Area */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <motion.div
                layout
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
                style={{ height: '600px' }}
              >
                <AnimatePresence mode="wait">
                  {viewMode === 'network' ? (
                    <motion.div
                      key="network"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <NetworkGraph
                        conversations={filteredConversations}
                        onNodeClick={setSelectedNode}
                        selectedNode={selectedNode}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="topics"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full"
                    >
                      <TopicsCloud
                        conversations={conversations}
                        onTopicHover={setHoveredTopic}
                        searchTerm={searchTerm}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            <div className="col-span-1">
              <ConversationPanel
                conversation={selectedNode}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          </div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Conversation Timeline</h3>
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
              <div className="space-y-4 pl-8">
                {filteredConversations.slice(0, 5).map((conv, idx) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative cursor-pointer group"
                    onClick={() => setSelectedNode(conv)}
                  >
                    <div className="absolute -left-[33px] top-2 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-gray-900"></div>
                    <div className="bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/50 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-white group-hover:text-blue-400 transition-colors">
                            {conv.title}
                          </div>
                          <div className="text-sm text-gray-400 mt-1">
                            {conv.timestamp.toLocaleDateString()} • {conv.messages} messages
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {conv.topics.slice(0, 2).map(topic => (
                            <span
                              key={topic}
                              className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
