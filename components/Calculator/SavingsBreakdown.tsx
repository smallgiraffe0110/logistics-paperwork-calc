'use client';

import { motion } from 'framer-motion';
import { TableProperties } from 'lucide-react';
import Card from '@/components/ui/Card';
import { CalculationResults } from '@/types';
import { formatCurrency } from '@/lib/calculations';

interface SavingsBreakdownProps {
  results: CalculationResults;
}

interface BreakdownRow {
  label: string;
  current: number;
  ours: number;
}

export default function SavingsBreakdown({ results }: SavingsBreakdownProps) {
  const currentData = results.breakdownData[0];
  const platformData = results.breakdownData[1];

  const rows: BreakdownRow[] = [
    { label: 'Labor Cost', current: currentData.laborCost, ours: platformData.laborCost },
    { label: 'Rework Cost', current: currentData.reworkCost, ours: platformData.reworkCost },
    { label: 'Software Cost', current: currentData.softwareCost, ours: platformData.softwareCost },
    { label: 'Setup Cost', current: currentData.setupCost, ours: platformData.setupCost },
    { label: 'Training Cost', current: currentData.trainingCost, ours: platformData.trainingCost },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45 }}
    >
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <TableProperties className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Detailed Cost Breakdown</h3>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cost Category</th>
                <th className="text-right py-3 px-4 font-medium text-red-600">
                  {results.currentWorkflow.name}
                </th>
                <th className="text-right py-3 px-4 font-medium text-purple-600">Our Platform</th>
                <th className="text-right py-3 px-4 font-medium text-green-600">You Save</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const diff = row.current - row.ours;
                return (
                  <tr
                    key={row.label}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-gray-700">{row.label}</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(row.current)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {formatCurrency(row.ours)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {diff > 0 ? (
                        <span className="text-green-600 font-medium">{formatCurrency(diff)}</span>
                      ) : diff < 0 ? (
                        <span className="text-red-500 font-medium">
                          +{formatCurrency(Math.abs(diff))}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-gray-50 font-bold">
                <td className="py-3 px-4 text-gray-900">Monthly Total</td>
                <td className="py-3 px-4 text-right text-red-600">
                  {formatCurrency(currentData.total)}
                </td>
                <td className="py-3 px-4 text-right text-purple-600">
                  {formatCurrency(platformData.total)}
                </td>
                <td className="py-3 px-4 text-right text-green-600">
                  {formatCurrency(currentData.total - platformData.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row) => {
            const diff = row.current - row.ours;
            return (
              <div key={row.label} className="p-3 bg-gray-50 rounded-xl">
                <p className="text-sm font-medium text-gray-700 mb-2">{row.label}</p>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-500">{results.currentWorkflow.name}</p>
                    <p className="font-medium text-gray-900">{formatCurrency(row.current)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Our Platform</p>
                    <p className="font-medium text-gray-900">{formatCurrency(row.ours)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Savings</p>
                    <p className={`font-medium ${diff >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {diff >= 0 ? formatCurrency(diff) : `-${formatCurrency(Math.abs(diff))}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-sm font-bold text-gray-900 mb-2">Monthly Total</p>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-xs text-gray-500">{results.currentWorkflow.name}</p>
                <p className="font-bold text-red-600">{formatCurrency(currentData.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Our Platform</p>
                <p className="font-bold text-purple-600">{formatCurrency(platformData.total)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">You Save</p>
                <p className="font-bold text-green-600">
                  {formatCurrency(currentData.total - platformData.total)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Costs are monthly per employee, based on {results.totalDocsProcessed.toLocaleString()}{' '}
          total monthly documents. Setup and training costs are one-time charges.
        </p>
      </Card>
    </motion.div>
  );
}
