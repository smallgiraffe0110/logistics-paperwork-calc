'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, ClipboardList, FileText, Users } from 'lucide-react';
import Input from '@/components/ui/Input';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateInput = (field: keyof CalculatorInputs, value: string | number) => {
    onInputChange({ ...inputs, [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (inputs.docsPerMonth < 0) newErrors.docsPerMonth = 'Must be 0 or greater';
    if (inputs.minutesPerDoc < 0) newErrors.minutesPerDoc = 'Must be 0 or greater';
    if (inputs.employees < 1) newErrors.employees = 'Must be at least 1';
    if (inputs.rejectionRate < 0 || inputs.rejectionRate > 100) {
      newErrors.rejectionRate = 'Must be between 0 and 100';
    }
    if (inputs.hourlyWage <= 0) newErrors.hourlyWage = 'Must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onCalculate();
    }
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
            <Input
              label="Documents per Employee / Month"
              type="number"
              value={inputs.docsPerMonth || ''}
              onChange={(e) => updateInput('docsPerMonth', Number(e.target.value))}
              placeholder="400"
              hint="BOLs, PODs, invoices, customs forms — per person, per month"
              error={errors.docsPerMonth}
              min={0}
              aria-label="Documents per employee per month"
            />

            <Input
              label="Minutes per Document"
              suffix="min"
              type="number"
              value={inputs.minutesPerDoc || ''}
              onChange={(e) => updateInput('minutesPerDoc', Number(e.target.value))}
              placeholder="6"
              hint="Average time to review and process one document"
              error={errors.minutesPerDoc}
              min={0}
              aria-label="Minutes spent reviewing each document"
            />

            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Input
                  label="Number of Employees"
                  type="number"
                  value={inputs.employees || ''}
                  onChange={(e) => updateInput('employees', Number(e.target.value))}
                  placeholder="3"
                  hint="How many people review paperwork"
                  error={errors.employees}
                  min={1}
                  aria-label="Number of employees reviewing paperwork"
                />
              </div>
              <div className="pb-1">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <Select
              label="Current Workflow"
              options={workflowOptions}
              value={inputs.currentWorkflow}
              onChange={(e) => updateInput('currentWorkflow', e.target.value)}
              aria-label="Select your current document workflow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Rejection / Re-Review Rate"
              suffix="%"
              type="number"
              value={inputs.rejectionRate || ''}
              onChange={(e) => updateInput('rejectionRate', Number(e.target.value))}
              placeholder="12"
              hint="Percent of docs that get kicked back and must be reviewed again."
              error={errors.rejectionRate}
              min={0}
              max={100}
              aria-label="Document rejection and re-review rate percentage"
            />

            <Input
              label="Average Hourly Wage"
              prefix="$"
              type="number"
              value={inputs.hourlyWage || ''}
              onChange={(e) => updateInput('hourlyWage', Number(e.target.value))}
              placeholder="28"
              hint="Fully-loaded hourly cost of a paperwork employee"
              error={errors.hourlyWage}
              min={0}
              aria-label="Average hourly wage for employees doing document review"
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
