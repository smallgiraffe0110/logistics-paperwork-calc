'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import InputForm from '@/components/Calculator/InputForm';
import ResultsDisplay from '@/components/Calculator/ResultsDisplay';
import SavingsBreakdown from '@/components/Calculator/SavingsBreakdown';
import { CalculatorInputs } from '@/types';
import { DEFAULT_INPUTS } from '@/lib/constants';
import { calculateCosts } from '@/lib/calculations';

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const results = useMemo(() => calculateCosts(inputs), [inputs]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-purple-600 rounded-xl">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Logistics Paperwork Calculator
            </h1>
            <p className="text-xs text-gray-500">
              docs × time × wage, with rejection rework
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <InputForm
            inputs={inputs}
            onInputChange={setInputs}
            onCalculate={() => undefined}
          />
        </motion.div>

        <ResultsDisplay results={results} />

        <SavingsBreakdown results={results} />
      </main>

      <footer className="py-8 text-center text-xs text-gray-500">
        Estimates based on the inputs above. Actual costs vary.
      </footer>
    </div>
  );
}
