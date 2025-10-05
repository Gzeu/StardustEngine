'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: string;
  index: number;
}

export default function FeatureCard({ icon, title, description, gradient, index }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
      
      {/* Border gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 rounded-xl blur-sm group-hover:opacity-40 transition-opacity duration-300`}></div>
      
      {/* Card content */}
      <div className="relative bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 h-full hover:border-white/20 transition-all duration-300">
        <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${gradient} mb-4`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        
        <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </p>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </motion.div>
  );
}