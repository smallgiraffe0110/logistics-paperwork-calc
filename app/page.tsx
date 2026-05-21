'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Share2, FileText, Clock, DollarSign, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import InputForm from '@/components/Calculator/InputForm';
import ResultsDisplay from '@/components/Calculator/ResultsDisplay';
import ComparisonChart from '@/components/Calculator/ComparisonChart';
import SavingsBreakdown from '@/components/Calculator/SavingsBreakdown';
import CryptoComparison from '@/components/Calculator/CryptoComparison';
import ShareModal from '@/components/ShareModal';
import Button from '@/components/ui/Button';
import { CalculatorInputs, CalculationResults } from '@/types';
import { DEFAULT_INPUTS } from '@/lib/constants';
import { calculateCosts } from '@/lib/calculations';
import { decodeParamsToInputs, trackEvent } from '@/lib/utils';

function CalculatorApp() {
  const searchParams = useSearchParams();
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Parse URL params on mount
  useEffect(() => {
    const urlInputs = decodeParamsToInputs(searchParams);
    if (Object.keys(urlInputs).length > 0) {
      const merged = { ...DEFAULT_INPUTS, ...urlInputs };
      setInputs(merged);
      const calcResults = calculateCosts(merged);
      setResults(calcResults);
      setShowResults(true);
    }
  }, [searchParams]);

  const handleCalculate = () => {
    const calcResults = calculateCosts(inputs);
    setResults(calcResults);
    setShowResults(true);
    trackEvent('calculate', { ...inputs });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleDownloadPdf = async () => {
    if (!results) return;
    setPdfLoading(true);
    try {
      const { generatePDF } = await import('@/lib/pdf-generator');
      const blob = await generatePDF(inputs, results);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paperwork-cost-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      trackEvent('pdf_download');
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Page intro */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
              Logistics Paperwork Cost Calculator
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-6 max-w-2xl">
              See exactly how much manual document review is costing your operation.
              Docs × time × wage, plus the rework hit from rejections.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                No setup fee
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-purple-600" />
                Live in 1 week
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-purple-600" />
                Works with your existing TMS
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Input Form */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <InputForm
                inputs={inputs}
                onInputChange={setInputs}
                onCalculate={handleCalculate}
              />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3" ref={resultsRef}>
            {showResults && results ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Your Results</h2>
                  <Button variant="outline" size="sm" onClick={() => setShareOpen(true)}>
                    <Share2 className="h-4 w-4 mr-1.5" />
                    Share
                  </Button>
                </div>

                <ResultsDisplay results={results} />
                <ComparisonChart results={results} />
                <SavingsBreakdown results={results} />
                <CryptoComparison results={results} />

                {/* CTA after results */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white border border-gray-200 rounded-2xl p-8 text-center"
                >
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    Ready to Stop Drowning in Paperwork?
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                    Join logistics teams cutting doc review time by 60%+.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button size="lg">Schedule a Demo</Button>
                    <Button variant="outline" size="lg" onClick={() => setShareOpen(true)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Report
                    </Button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center text-gray-400">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Enter your details to see results</p>
                  <p className="text-sm mt-1">Your cost breakdown will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="bg-white border-t border-gray-100 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
            Why Logistics Teams Switch to Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'Cut Cost 50%+',
                desc: 'Logistics teams cut paperwork cost in half within 90 days.',
              },
              {
                icon: Clock,
                title: 'Live in 1 Week',
                desc: 'No multi-month rollout. Plug in, train your team, go.',
              },
              {
                icon: CheckCircle,
                title: 'Rejection Rate Drops to 2%',
                desc: 'Built-in validation kills the rework cycle.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center p-6"
              >
                <div className="inline-flex p-3 bg-purple-100 rounded-2xl mb-4">
                  <item.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p>
            Logistics Paperwork Calculator. Built to help logistics teams stop losing money to
            manual document review.
          </p>
          <p className="mt-2">
            Estimates are based on the inputs you provide. Actual costs may vary.
          </p>
        </div>
      </footer>

      {/* Share Modal */}
      {results && (
        <ShareModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          inputs={inputs}
          results={results}
          onDownloadPdf={handleDownloadPdf}
          pdfLoading={pdfLoading}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <CalculatorApp />
    </Suspense>
  );
}
