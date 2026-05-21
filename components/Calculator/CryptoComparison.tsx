'use client';

import { motion } from 'framer-motion';
import { Zap, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card from '@/components/ui/Card';
import { CalculationResults } from '@/types';
import { formatCurrency } from '@/lib/calculations';

interface CryptoComparisonProps {
  results: CalculationResults;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 text-sm">
      <p className="font-medium text-gray-900 mb-2">Year {label}</p>
      {payload.map((item) => (
        <p key={item.name} style={{ color: item.color }} className="font-medium">
          {item.name}: {formatCurrency(item.value)}
        </p>
      ))}
    </div>
  );
}

export default function CryptoComparison({ results }: CryptoComparisonProps) {
  const chartData = results.timelineData.map((item) => ({
    year: `${item.year}`,
    [results.currentWorkflow.name]: item.currentCost,
    'Our Platform': item.optimizedCost,
    'AI Auto-Review': item.automatedCost,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                AI Auto-Review (Future)
              </h3>
              <p className="text-sm text-gray-600">
                Near-zero rework. 80%+ lower paperwork cost.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-200 text-amber-800">
            Coming 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-white/60 rounded-xl">
            <p className="text-sm text-gray-600">AI Auto-Review Annual Cost</p>
            <p className="text-xl font-bold text-amber-700">
              {formatCurrency(results.automatedAnnualCost)}
            </p>
          </div>
          <div className="p-4 bg-white/60 rounded-xl">
            <p className="text-sm text-gray-600">vs {results.currentWorkflow.name}</p>
            <p className="text-xl font-bold text-green-600">
              Save {formatCurrency(results.automatedAnnualSavings)}/yr
            </p>
          </div>
          <div className="p-4 bg-white/60 rounded-xl">
            <p className="text-sm text-gray-600">Rejection rate</p>
            <p className="text-xl font-bold text-amber-700">0.5%</p>
          </div>
        </div>

        <div className="bg-white/60 rounded-xl p-4 mb-6">
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: 'Year',
                    position: 'insideBottomRight',
                    offset: -5,
                    fontSize: 12,
                    fill: '#9ca3af',
                  }}
                />
                <YAxis
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey={results.currentWorkflow.name}
                  stroke="#ef4444"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="Our Platform"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="AI Auto-Review"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  strokeDasharray="5 5"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
          <TrendingUp className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-700">
            <p className="font-semibold mb-1">Why AI doc automation is the future</p>
            <p>
              When AI extracts and validates docs end-to-end, rework drops to near zero. Costs fall
              80%+. Legacy TMS vendors can&apos;t catch up — they&apos;re built around manual
              workflows.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
