import { motion } from 'framer-motion'

const LoadingAnimation = () => {
  const circleVariants = {
    start: {
      y: '0%',
    },
    end: {
      y: '100%',
    },
  }

  const transition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: 'easeInOut',
  }

  return (
    <div className="flex justify-center items-center">
      <svg width="50" height="60" viewBox="0 0 50 60">
        <motion.circle
          cx="25"
          cy="30"
          r="5"
          fill="var(--primary)"
          variants={circleVariants}
          initial="start"
          animate="end"
          transition={{
            ...transition,
            delay: 0,
          }}
        />
        <motion.circle
          cx="25"
          cy="30"
          r="5"
          fill="var(--primary)"
          variants={circleVariants}
          initial="start"
          animate="end"
          transition={{
            ...transition,
            delay: 0.2,
          }}
        />
        <motion.circle
          cx="25"
          cy="30"
          r="5"
          fill="var(--primary)"
          variants={circleVariants}
          initial="start"
          animate="end"
          transition={{
            ...transition,
            delay: 0.4,
          }}
        />
      </svg>
    </div>
  )
}

export default LoadingAnimation