'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import Card from '@/components/ui/Card';
import { CalculationResults } from '@/types';
import { formatCurrency } from '@/lib/calculations';

interface ComparisonChartProps {
  results: CalculationResults;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; cost: number; color: string } }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100">
      <p className="font-semibold text-gray-900">{data.name}</p>
      <p className="text-lg font-bold" style={{ color: data.color }}>
        {formatCurrency(data.cost)}/mo
      </p>
    </div>
  );
}

export default function ComparisonChart({ results }: ComparisonChartProps) {
  const chartData = results.breakdownData.map((item) => ({
    name: item.workflow,
    cost: item.total,
    color: item.color,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-xl">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Monthly Cost Comparison</h3>
        </div>

        <div className="h-72 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" radius={[8, 8, 0, 0]} maxBarSize={80}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          Monthly paperwork cost per employee. Lower is better.
        </p>
      </Card>
    </motion.div>
  );
}
