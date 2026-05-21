'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Download, Mail, Linkedin, Check } from 'lucide-react';
import Button from '@/components/ui/Button';
import { CalculatorInputs, CalculationResults } from '@/types';
import { encodeInputsToParams, trackEvent } from '@/lib/utils';
import { formatCurrency } from '@/lib/calculations';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: CalculatorInputs;
  results: CalculationResults;
  onDownloadPdf: () => void;
  pdfLoading: boolean;
}

export default function ShareModal({
  isOpen,
  onClose,
  inputs,
  results,
  onDownloadPdf,
  pdfLoading,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?${encodeInputsToParams(inputs)}`
      : '';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      trackEvent('share_copy_link');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkedInShare = () => {
    const text = `Our logistics ops could save ${formatCurrency(results.annualSavings)}/year on paperwork. Check out this calc:`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=500');
    trackEvent('share_linkedin');
  };

  const handleEmailSend = () => {
    if (!email) return;
    const subject = `Logistics Paperwork Cost Report - ${formatCurrency(results.annualSavings)}/year`;
    const body = `Here's a logistics paperwork cost report I generated:\n\nAnnual Savings: ${formatCurrency(results.annualSavings)}\nMonthly Savings: ${formatCurrency(results.monthlySavings)}\n5-Year Savings: ${formatCurrency(results.fiveYearSavings)}\n\nView full report: ${shareUrl}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    trackEvent('share_email');
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md p-6 shadow-xl z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Share your results"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Share Your Results</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close share dialog"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Copy Link */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Share Link</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 truncate"
                    aria-label="Share URL"
                  />
                  <Button
                    variant={copied ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Download PDF */}
              <Button
                variant="primary"
                className="w-full"
                onClick={onDownloadPdf}
                loading={pdfLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF Report
              </Button>

              {/* Email */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Email Report</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-200"
                    aria-label="Email address"
                  />
                  <Button variant="outline" size="sm" onClick={handleEmailSend} disabled={!email}>
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* LinkedIn */}
              <Button
                variant="ghost"
                className="w-full text-blue-700 hover:bg-blue-50"
                onClick={handleLinkedInShare}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                Share on LinkedIn
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
