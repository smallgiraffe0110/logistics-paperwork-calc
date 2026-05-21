'use client';

import { useState, useMemo } from 'react';
import Slider from '@/components/ui/Slider';
import { CalculatorInputs } from '@/types';
import { DEFAULT_INPUTS, WORKFLOWS } from '@/lib/constants';
import { calculateCosts, formatCurrency } from '@/lib/calculations';

const workflowKeys = Object.keys(WORKFLOWS).filter(
  (k) => k !== 'ourPlatform' && k !== 'aiAutomated'
);

export default function Home() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const results = useMemo(() => calculateCosts(inputs), [inputs]);

  const totalDocs = inputs.docsPerMonth * inputs.employees;
  const orgMonthlyCost = results.currentMonthlyCost * inputs.employees;
  const orgAnnualSavings = results.annualSavings;
  const orgMonthlySavings = results.monthlySavings;
  const effectivePerDoc = totalDocs > 0 ? orgMonthlyCost / (totalDocs * (1 + inputs.rejectionRate / 100)) : 0;

  const update = <K extends keyof CalculatorInputs>(field: K, value: CalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-2xl mx-auto px-6 pt-16 pb-24">
        <p className="text-xs tracking-[0.2em] text-gray-500 text-center uppercase mb-4">
          Calculator
        </p>
        <h1 className="font-serif text-5xl md:text-6xl text-center text-gray-900 leading-[1.05] mb-12">
          See what you&apos;re really paying for paperwork
        </h1>

        <div className="mb-10">
          <p className="text-sm font-semibold text-gray-900 mb-3">Current workflow</p>
          <div className="grid grid-cols-3 gap-2">
            {workflowKeys.map((key) => {
              const wf = WORKFLOWS[key];
              const selected = inputs.currentWorkflow === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => update('currentWorkflow', key)}
                  className={`rounded-xl px-4 py-3 text-center transition-colors ${
                    selected
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-sm font-semibold">{wf.name}</div>
                  <div className={`text-xs mt-0.5 ${selected ? 'text-gray-300' : 'text-gray-500'}`}>
                    {Math.round(wf.timeMultiplier * 100)}% of base time
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-7 mb-10">
          <Slider
            label="Documents per employee / month"
            value={inputs.docsPerMonth}
            onChange={(v) => update('docsPerMonth', v)}
            min={0}
            max={5000}
            step={50}
            format={(n) => n.toLocaleString()}
          />
          <Slider
            label="Minutes per document"
            value={inputs.minutesPerDoc}
            onChange={(v) => update('minutesPerDoc', v)}
            min={1}
            max={60}
            step={1}
            format={(n) => `${n} min`}
          />
          <Slider
            label="Employees"
            value={inputs.employees}
            onChange={(v) => update('employees', v)}
            min={1}
            max={50}
            step={1}
          />
          <Slider
            label="Rejection / re-review rate"
            value={inputs.rejectionRate}
            onChange={(v) => update('rejectionRate', v)}
            min={0}
            max={40}
            step={1}
            format={(n) => `${n}%`}
          />
          <Slider
            label="Hourly wage"
            value={inputs.hourlyWage}
            onChange={(v) => update('hourlyWage', v)}
            min={10}
            max={80}
            step={1}
            format={(n) => `$${n}`}
          />
        </div>

        <hr className="border-gray-200 mb-8" />

        <p className="text-gray-700 leading-relaxed mb-8">
          Across <strong className="text-gray-900">{inputs.employees}</strong> employees processing{' '}
          <strong className="text-gray-900">{totalDocs.toLocaleString()}</strong> documents/mo
          {inputs.rejectionRate > 0 && (
            <>
              {' '}(plus{' '}
              <strong className="text-gray-900">
                {Math.round(totalDocs * (inputs.rejectionRate / 100)).toLocaleString()}
              </strong>{' '}
              re-reviews)
            </>
          )}{' '}
          on <strong className="text-gray-900">{results.currentWorkflow.name}</strong>, you&apos;re
          spending <strong className="text-gray-900">{formatCurrency(orgMonthlyCost)}/month</strong>{' '}
          in labor — an effective cost of{' '}
          <strong className="text-gray-900">${effectivePerDoc.toFixed(2)}/doc</strong>.
        </p>

        {orgAnnualSavings > 0 && (
          <div className="bg-gray-100 rounded-2xl p-8 md:p-10">
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 leading-tight mb-3">
              Switch to our automated workflow and save{' '}
              <strong>~{formatCurrency(orgAnnualSavings)}/year</strong>.
            </h2>
            <p className="text-sm text-gray-600">
              That&apos;s <strong className="text-gray-900">{formatCurrency(orgMonthlySavings)}/month</strong>{' '}
              back in your team&apos;s capacity.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
