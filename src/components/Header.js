import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Book, Github } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        isScrolled ? 'bg-background/80 shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Book className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            KnowledgeGraph AI
          </span>
        </motion.div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                About
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Contact
              </Button>
            </li>
            <li>
              <Button variant="outline" className="text-foreground hover:text-primary">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  )
}