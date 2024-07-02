import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ZoomIn, ZoomOut, Move, Search, X, Loader } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import * as d3 from 'd3'

export default function KnowledgeGraphVisualization() {
  const svgRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)

    // Simulating data fetching
    setTimeout(() => {
      const fetchedData = generateMockData()
      if (fetchedData) {
        setData(fetchedData)
        setIsLoading(false)
      } else {
        setError("Failed to load knowledge graph. Please try again.")
        setIsLoading(false)
      }
    }, 2000)
  }, [])

  useEffect(() => {
    if (data) {
      renderGraph()
    }
  }, [data, searchTerm])

  const generateMockData = () => {
    // Generate mock data for the knowledge graph
    const nodes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      name: `Concept ${i + 1}`,
      group: Math.floor(Math.random() * 5)
    }))

    const links = Array.from({ length: 100 }, () => ({
      source: Math.floor(Math.random() * nodes.length),
      target: Math.floor(Math.random() * nodes.length),
      value: Math.random()
    }))

    return { nodes, links }
  }

  const renderGraph = () => {
    if (!svgRef.current || !data) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous render

    const g = svg.append("g")

    const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink(data.links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value))

    const node = g.append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", 5)
      .attr("fill", d => d3.schemeCategory10[d.group])
      .call(drag(simulation))

    node.append("title")
      .text(d => d.name)

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y)

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
    })

    // Zoom and pan functionality
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom)

    // Node selection
    node.on("click", (event, d) => {
      setSelectedNode(d)
    })

    // Search functionality
    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, 'i')
      node.attr('opacity', d => searchRegex.test(d.name) ? 1 : 0.1)
      link.attr('opacity', d => searchRegex.test(d.source.name) || searchRegex.test(d.target.name) ? 0.6 : 0.1)
    } else {
      node.attr('opacity', 1)
      link.attr('opacity', 0.6)
    }
  }

  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended)
  }

  const handleZoomIn = () => {
    d3.select(svgRef.current).transition().call(d3.zoom().scaleBy, 1.2)
  }

  const handleZoomOut = () => {
    d3.select(svgRef.current).transition().call(d3.zoom().scaleBy, 0.8)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      handleZoomIn()
    } else if (e.key === 'ArrowDown') {
      handleZoomOut()
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-card rounded-lg">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div 
      className="relative w-full h-[calc(100vh-200px)] bg-card rounded-lg overflow-hidden shadow-lg bg-pattern"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      aria-label="Knowledge Graph Visualization"
    >
      <svg ref={svgRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="secondary" size="icon" onClick={handleZoomIn} aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" onClick={handleZoomOut} aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
            aria-label="Search nodes"
          />
          {searchTerm && (
            <Button variant="ghost" size="icon" onClick={() => setSearchTerm('')} aria-label="Clear search">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {selectedNode && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-2">{selectedNode.name}</h3>
          <p>Group: {selectedNode.group}</p>
          <p>Connections: {data.links.filter(link => link.source.id === selectedNode.id || link.target.id === selectedNode.id).length}</p>
        </motion.div>
      )}
    </div>
  )
}