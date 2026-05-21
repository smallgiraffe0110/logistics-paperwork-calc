'use client';

import { motion } from 'framer-motion';
import { Calculator, ClipboardList, Users, Percent } from 'lucide-react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Slider from '@/components/ui/Slider';
import { CalculatorInputs } from '@/types';
import { WORKFLOWS, LOGISTICS_PRESETS } from '@/lib/constants';

interface InputFormProps {
  inputs: CalculatorInputs;
  onInputChange: (inputs: CalculatorInputs) => void;
  onCalculate?: () => void;
}

const workflowOptions = Object.entries(WORKFLOWS)
  .filter(([key]) => key !== 'ourPlatform' && key !== 'aiAutomated')
  .map(([key, workflow]) => ({
    value: key,
    label: workflow.name,
  }));

export default function InputForm({ inputs, onInputChange }: InputFormProps) {
  const updateInput = (field: keyof CalculatorInputs, value: string | number) => {
    onInputChange({ ...inputs, [field]: value });
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

        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <Input
                label="Documents per Employee / Month"
                type="number"
                value={inputs.docsPerMonth || ''}
                onChange={(e) => updateInput('docsPerMonth', Number(e.target.value))}
                placeholder="1,200"
                hint="BOLs, PODs, invoices, customs forms"
                min={0}
                aria-label="Documents per employee per month"
              />
              <div className="mt-2">
                <Slider
                  value={inputs.docsPerMonth}
                  onChange={(v) => updateInput('docsPerMonth', v)}
                  min={0}
                  max={10000}
                  step={50}
                />
              </div>
            </div>

            <div>
              <Input
                label="Minutes per Document"
                suffix="min"
                type="number"
                value={inputs.minutesPerDoc || ''}
                onChange={(e) => updateInput('minutesPerDoc', Number(e.target.value))}
                placeholder="9"
                hint="Average review + process time"
                min={0}
                aria-label="Minutes per document"
              />
              <div className="mt-2">
                <Slider
                  value={inputs.minutesPerDoc}
                  onChange={(v) => updateInput('minutesPerDoc', v)}
                  min={1}
                  max={60}
                  step={1}
                />
              </div>
            </div>

            <div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label="Number of Employees"
                    type="number"
                    value={inputs.employees || ''}
                    onChange={(e) => updateInput('employees', Number(e.target.value))}
                    placeholder="3"
                    min={1}
                    aria-label="Number of employees doing paperwork"
                  />
                </div>
                <div className="pb-1">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="mt-2">
                <Slider
                  value={inputs.employees}
                  onChange={(v) => updateInput('employees', v)}
                  min={1}
                  max={100}
                  step={1}
                />
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
            <div>
              <Input
                label="Rejection / Re-Review Rate"
                suffix="%"
                type="number"
                value={inputs.rejectionRate || ''}
                onChange={(e) => updateInput('rejectionRate', Number(e.target.value))}
                placeholder="12"
                hint="Percent of docs kicked back for re-review"
                min={0}
                max={100}
                aria-label="Document rejection / rework rate percent"
              />
              <div className="mt-2">
                <Slider
                  value={inputs.rejectionRate}
                  onChange={(v) => updateInput('rejectionRate', v)}
                  min={0}
                  max={50}
                  step={1}
                />
              </div>
            </div>

            <div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label="Average Hourly Wage"
                    prefix="$"
                    type="number"
                    value={inputs.hourlyWage || ''}
                    onChange={(e) => updateInput('hourlyWage', Number(e.target.value))}
                    placeholder="28"
                    hint="Fully-loaded hourly labor cost"
                    min={0}
                    aria-label="Average hourly wage in dollars"
                  />
                </div>
                <div className="pb-1">
                  <Percent className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="mt-2">
                <Slider
                  value={inputs.hourlyWage}
                  onChange={(v) => updateInput('hourlyWage', v)}
                  min={10}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-500 pt-2">
            Results update live as you change inputs.
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
