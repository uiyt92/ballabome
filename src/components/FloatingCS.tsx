'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

export default function FloatingCS() {
    return (
        <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-8 right-8 z-[100] w-14 h-14 bg-zinc-900 text-white flex items-center justify-center rounded-full shadow-lg hover:bg-zinc-800 transition-colors"
        >
            <MessageCircle className="w-6 h-6" />
        </motion.button>
    )
}
