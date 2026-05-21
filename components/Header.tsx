'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Logistics Paperwork Calculator
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
              See how much paperwork is costing your operation
            </p>
          </div>
        </div>
        <a
          href="#calculator"
          className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
        >
          Calculate Now
        </a>
      </div>
    </motion.header>
  );
}
