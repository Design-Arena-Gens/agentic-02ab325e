'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface ConversationNode {
  id: string
  title: string
  timestamp: Date
  topics: string[]
  connections: string[]
  messages: number
  summary: string
}

interface ConversationPanelProps {
  conversation: ConversationNode | null
  onClose: () => void
}

export default function ConversationPanel({ conversation, onClose }: ConversationPanelProps) {
  return (
    <AnimatePresence>
      {conversation ? (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
          style={{ height: '600px' }}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {conversation.title}
                  </h2>
                  <div className="text-sm text-blue-100">
                    {conversation.timestamp.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400">
                    {conversation.messages}
                  </div>
                  <div className="text-sm text-gray-400">Messages</div>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400">
                    {conversation.connections.length}
                  </div>
                  <div className="text-sm text-gray-400">Connections</div>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Summary
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {conversation.summary}
                </p>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {conversation.topics.map((topic, idx) => (
                    <motion.span
                      key={topic}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="px-3 py-1.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 rounded-full text-sm font-medium"
                    >
                      {topic}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Key Insights */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Key Insights
                </h3>
                <div className="space-y-2">
                  {[
                    'Explored fundamental concepts and definitions',
                    'Discussed practical applications and use cases',
                    'Analyzed pros and cons of different approaches',
                    'Connected to related topics and themes'
                  ].map((insight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 text-gray-300"
                    >
                      <svg className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{insight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Connections */}
              {conversation.connections.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Related Conversations
                  </h3>
                  <div className="space-y-2">
                    {conversation.connections.map((connId, idx) => (
                      <motion.div
                        key={connId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600 rounded-lg p-3 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-300">Conversation #{connId}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-full bg-gray-800/20 backdrop-blur-sm border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center p-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              No Conversation Selected
            </h3>
            <p className="text-sm text-gray-500">
              Click on a node in the network or a topic to view details
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
