import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Copy, Check, Loader } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ChatEngine() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const scrollAreaRef = useRef(null)

  useEffect(() => {
    // Simulate loading chat history
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (Math.random() > 0.9) {
        setError("Failed to load chat history. Please refresh the page.")
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input, timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)
    setError(null)

    try {
      // Simulate AI response delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      const aiResponse = { role: 'assistant', content: 'This is a placeholder response. Implement actual AI response here.', timestamp: new Date().toISOString() }
      setMessages(prev => [...prev, aiResponse])
    } catch (err) {
      setError("Failed to get a response. Please try again.")
    } finally {
      setIsTyping(false)
    }
  }

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content)
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
    <div className="flex flex-col h-[calc(100vh-200px)] bg-card rounded-lg shadow-lg overflow-hidden">
      <ScrollArea className="flex-grow p-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 p-3 rounded-lg ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted'
              } max-w-[80%] relative group`}
            >
              <p className="break-words">{msg.content}</p>
              <span className="text-xs text-muted-foreground mt-1 block">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
              {msg.role === 'assistant' && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(msg.content)}
                  aria-label="Copy message"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground italic"
          >
            AI is typing...
          </motion.div>
        )}
      </ScrollArea>
      <div className="flex items-center space-x-2 p-4 bg-muted">
        <Input
          type="text"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-grow"
          aria-label="Chat input"
        />
        <Button onClick={handleSend} disabled={isTyping} aria-label="Send message">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}