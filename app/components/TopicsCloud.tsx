'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ConversationNode {
  id: string
  title: string
  timestamp: Date
  topics: string[]
  connections: string[]
  messages: number
  summary: string
}

interface TopicsCloudProps {
  conversations: ConversationNode[]
  onTopicHover: (topic: string | null) => void
  searchTerm: string
}

export default function TopicsCloud({ conversations, onTopicHover, searchTerm }: TopicsCloudProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null)

  // Calculate topic frequencies
  const topicMap = new Map<string, number>()
  conversations.forEach(conv => {
    conv.topics.forEach(topic => {
      topicMap.set(topic, (topicMap.get(topic) || 0) + 1)
    })
  })

  const topics = Array.from(topicMap.entries())
    .map(([topic, count]) => ({
      name: topic,
      count,
      size: 20 + count * 8
    }))
    .sort((a, b) => b.count - a.count)

  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-cyan-400 to-cyan-600',
    'from-green-400 to-green-600',
    'from-orange-400 to-orange-600',
    'from-pink-400 to-pink-600',
    'from-indigo-400 to-indigo-600',
    'from-teal-400 to-teal-600',
  ]

  const handleTopicHover = (topic: string | null) => {
    setHoveredTopic(topic)
    onTopicHover(topic)
  }

  return (
    <div className="w-full h-full bg-gray-900/50 p-8 overflow-auto">
      <div className="flex flex-wrap gap-4 items-center justify-center">
        {topics.map((topic, idx) => {
          const isHighlighted = searchTerm && topic.name.toLowerCase().includes(searchTerm.toLowerCase())
          const isHovered = hoveredTopic === topic.name

          return (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: searchTerm && !isHighlighted ? 0.3 : 1,
                scale: isHovered ? 1.2 : 1
              }}
              transition={{ delay: idx * 0.05 }}
              onMouseEnter={() => handleTopicHover(topic.name)}
              onMouseLeave={() => handleTopicHover(null)}
              className="cursor-pointer"
            >
              <div
                className={`bg-gradient-to-br ${colors[idx % colors.length]} rounded-full px-6 py-3 shadow-lg hover:shadow-xl transition-all`}
                style={{
                  fontSize: `${topic.size}px`,
                  fontWeight: 600,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-white">{topic.name}</span>
                  <span className="bg-white/30 text-white text-xs px-2 py-1 rounded-full">
                    {topic.count}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {hoveredTopic && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-gray-800/80 backdrop-blur-sm rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-3">
            Conversations about "{hoveredTopic}"
          </h3>
          <div className="space-y-2">
            {conversations
              .filter(conv => conv.topics.includes(hoveredTopic))
              .map(conv => (
                <div
                  key={conv.id}
                  className="bg-gray-700/50 rounded-lg p-3 hover:bg-gray-700 transition-all"
                >
                  <div className="font-medium text-white">{conv.title}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {conv.messages} messages • {conv.timestamp.toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
