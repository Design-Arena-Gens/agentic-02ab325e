'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface ConversationNode {
  id: string
  title: string
  timestamp: Date
  topics: string[]
  connections: string[]
  messages: number
  summary: string
}

interface NetworkGraphProps {
  conversations: ConversationNode[]
  onNodeClick: (node: ConversationNode) => void
  selectedNode: ConversationNode | null
}

export default function NetworkGraph({ conversations, onNodeClick, selectedNode }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || conversations.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const g = svg.append('g')

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create nodes
    const nodes = conversations.map(conv => ({
      ...conv,
      x: width / 2 + (Math.random() - 0.5) * 400,
      y: height / 2 + (Math.random() - 0.5) * 400,
      vx: 0,
      vy: 0
    }))

    // Create links
    const links: { source: string; target: string }[] = []
    conversations.forEach(conv => {
      conv.connections.forEach(targetId => {
        if (conversations.find(c => c.id === targetId)) {
          links.push({ source: conv.id, target: targetId })
        }
      })
    })

    // Force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50))

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#374151')
      .attr('stroke-width', 2)
      .attr('opacity', 0.6)

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(d3.drag<any, any>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))

    // Node circles
    node.append('circle')
      .attr('r', (d: any) => Math.min(20 + d.messages / 2, 40))
      .attr('fill', (d: any) => {
        const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']
        return colors[parseInt(d.id) % colors.length]
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 3)
      .attr('opacity', 0.9)

    // Node labels
    node.append('text')
      .text((d: any) => d.title.length > 15 ? d.title.substring(0, 15) + '...' : d.title)
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => Math.min(20 + d.messages / 2, 40) + 20)
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .style('pointer-events', 'none')

    // Message count badge
    node.append('circle')
      .attr('r', 12)
      .attr('fill', '#dc2626')
      .attr('cx', (d: any) => Math.min(20 + d.messages / 2, 40) * 0.7)
      .attr('cy', (d: any) => -Math.min(20 + d.messages / 2, 40) * 0.7)

    node.append('text')
      .text((d: any) => d.messages)
      .attr('text-anchor', 'middle')
      .attr('dx', (d: any) => Math.min(20 + d.messages / 2, 40) * 0.7)
      .attr('dy', (d: any) => -Math.min(20 + d.messages / 2, 40) * 0.7 + 4)
      .attr('fill', '#fff')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none')

    // Click handler
    node.on('click', (event, d) => {
      onNodeClick(d as ConversationNode)
    })

    // Hover effects
    node.on('mouseenter', function(event, d) {
      d3.select(this).select('circle').transition()
        .duration(200)
        .attr('r', (d: any) => Math.min(20 + d.messages / 2, 40) + 5)
        .attr('opacity', 1)
    })

    node.on('mouseleave', function(event, d) {
      d3.select(this).select('circle').transition()
        .duration(200)
        .attr('r', (d: any) => Math.min(20 + d.messages / 2, 40))
        .attr('opacity', 0.9)
    })

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Highlight selected node
    if (selectedNode) {
      node.selectAll('circle').attr('stroke', (d: any) =>
        d.id === selectedNode.id ? '#fbbf24' : '#fff'
      ).attr('stroke-width', (d: any) =>
        d.id === selectedNode.id ? 5 : 3
      )
    }

    return () => {
      simulation.stop()
    }
  }, [conversations, selectedNode, onNodeClick])

  return (
    <div className="w-full h-full relative bg-gray-900/50">
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm text-gray-300">
        <div className="flex items-center gap-2">
          <span>💡 Drag nodes • Scroll to zoom • Click to view details</span>
        </div>
      </div>
    </div>
  )
}
