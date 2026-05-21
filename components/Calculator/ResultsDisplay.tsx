'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, DollarSign, Calendar, Clock } from 'lucide-react';
import Card from '@/components/ui/Card';
import { CalculationResults } from '@/types';
import { formatCurrency } from '@/lib/calculations';

interface ResultsDisplayProps {
  results: CalculationResults;
}

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayed(Math.round(eased * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{formatCurrency(displayed)}</>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const savingsCards = [
    {
      icon: DollarSign,
      title: 'Monthly Savings',
      value: results.monthlySavings,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: Calendar,
      title: 'Annual Savings',
      value: results.annualSavings,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: Clock,
      title: '5-Year Savings',
      value: results.fiveYearSavings,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Hero Savings Card */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-br from-purple-600 to-purple-800 text-white border-0 p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingDown className="h-6 w-6" />
            <p className="text-purple-200 font-medium text-lg">Your Potential Savings</p>
          </div>
          <p className="text-5xl md:text-6xl font-bold mb-2">
            <AnimatedNumber value={results.annualSavings} />
          </p>
          <p className="text-purple-200">per year by streamlining paperwork</p>
          {results.firstYearSavings > results.annualSavings && (
            <p className="mt-3 text-sm text-purple-200 bg-purple-700/50 rounded-lg inline-block px-4 py-1">
              First year savings: {formatCurrency(results.firstYearSavings)} (includes setup cost
              savings)
            </p>
          )}
        </Card>
      </motion.div>

      {/* Savings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savingsCards.map((card) => (
          <motion.div key={card.title} variants={itemVariants}>
            <Card hover className="text-center h-full">
              <div className={`inline-flex p-2.5 rounded-xl ${card.bg} mb-3`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className={`text-2xl font-bold ${card.color}`}>
                <AnimatedNumber value={card.value} duration={1200} />
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Cost Comparison */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm font-medium text-red-600 mb-1">
                {results.currentWorkflow.name} Costs
              </p>
              <p className="text-2xl font-bold text-red-700">
                {formatCurrency(results.currentMonthlyCost)}
                <span className="text-sm font-normal">/mo</span>
              </p>
              <p className="text-sm text-red-500 mt-1">
                {formatCurrency(results.currentAnnualCost)}/year
              </p>
              {results.currentWorkflow.setupCost > 0 && (
                <p className="text-xs text-red-400 mt-1">
                  + {formatCurrency(results.currentWorkflow.setupCost)} setup cost
                </p>
              )}
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm font-medium text-green-600 mb-1">Our Platform Costs</p>
              <p className="text-2xl font-bold text-green-700">
                {formatCurrency(results.optimizedMonthlyCost)}
                <span className="text-sm font-normal">/mo</span>
              </p>
              <p className="text-sm text-green-500 mt-1">
                {formatCurrency(results.optimizedAnnualCost)}/year
              </p>
              <p className="text-xs text-green-400 mt-1">No setup cost. No training cost.</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
