'use client';

import { motion } from 'framer-motion';
import { Calculator, ClipboardList, FileText } from 'lucide-react';
import Slider from '@/components/ui/Slider';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { CalculatorInputs } from '@/types';
import { WORKFLOWS, LOGISTICS_PRESETS } from '@/lib/constants';

interface InputFormProps {
  inputs: CalculatorInputs;
  onInputChange: (inputs: CalculatorInputs) => void;
  onCalculate: () => void;
}

const workflowOptions = Object.entries(WORKFLOWS)
  .filter(([key]) => key !== 'ourPlatform' && key !== 'aiAutomated')
  .map(([key, workflow]) => ({
    value: key,
    label: workflow.name,
  }));

export default function InputForm({ inputs, onInputChange, onCalculate }: InputFormProps) {
  const updateInput = (field: keyof CalculatorInputs, value: string | number) => {
    onInputChange({ ...inputs, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate();
  };

  const applyPreset = (presetKey: string) => {
    const preset = LOGISTICS_PRESETS[presetKey];
    if (preset) {
      onInputChange({ ...inputs, ...preset.inputs });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-xl">
            <Calculator className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Enter Your Details</h2>
        </div>

        {/* Preset Buttons */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Quick fill by operation type:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LOGISTICS_PRESETS).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                type="button"
                onClick={() => applyPreset(key)}
                className="text-xs"
              >
                <ClipboardList className="h-3 w-3 mr-1" />
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Slider
              label="Documents per Employee / Month"
              value={inputs.docsPerMonth}
              onChange={(v) => updateInput('docsPerMonth', v)}
              min={0}
              max={10000}
              step={50}
              format={(n) => n.toLocaleString()}
              hint="BOLs, PODs, invoices, customs forms — per person, per month"
            />

            <Slider
              label="Minutes per Document"
              value={inputs.minutesPerDoc}
              onChange={(v) => updateInput('minutesPerDoc', v)}
              min={1}
              max={60}
              step={1}
              suffix=" min"
              hint="Average time to review and process one document"
            />

            <Slider
              label="Number of Employees"
              value={inputs.employees}
              onChange={(v) => updateInput('employees', v)}
              min={1}
              max={100}
              step={1}
              hint="How many people review paperwork"
            />

            <Select
              label="Current Workflow"
              options={workflowOptions}
              value={inputs.currentWorkflow}
              onChange={(e) => updateInput('currentWorkflow', e.target.value)}
              aria-label="Select your current document workflow"
            />

            <Slider
              label="Rejection / Re-Review Rate"
              value={inputs.rejectionRate}
              onChange={(v) => updateInput('rejectionRate', v)}
              min={0}
              max={50}
              step={1}
              suffix="%"
              hint="Percent of docs that get kicked back and must be reviewed again."
            />

            <Slider
              label="Average Hourly Wage"
              value={inputs.hourlyWage}
              onChange={(v) => updateInput('hourlyWage', v)}
              min={10}
              max={100}
              step={1}
              prefix="$"
              suffix="/hr"
              hint="Fully-loaded hourly cost of a paperwork employee"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-6">
            <FileText className="h-5 w-5 mr-2" />
            Calculate My Cost
          </Button>

          <p className="text-center text-xs text-gray-500">
            No signup required. See results instantly.
          </p>
        </form>
      </Card>
    </motion.div>
  );
}
