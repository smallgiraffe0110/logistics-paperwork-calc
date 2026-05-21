import { WorkflowProfile, CalculatorInputs } from '@/types';

export const WORKFLOWS: Record<string, WorkflowProfile> = {
  manual: {
    name: 'Manual / Paper-Based',
    timeMultiplier: 1.0,
    rejectionRateOverride: null,
    softwareCostMonthly: 0,
    setupCost: 0,
    trainingCost: 0,
    description: 'Paper, email, spreadsheets — everything reviewed by hand',
  },
  legacyTms: {
    name: 'Legacy TMS',
    timeMultiplier: 0.85,
    rejectionRateOverride: null,
    softwareCostMonthly: 450,
    setupCost: 8000,
    trainingCost: 3000,
    description: 'Older TMS with basic doc handling — still mostly manual review',
  },
  modernTms: {
    name: 'Modern TMS',
    timeMultiplier: 0.7,
    rejectionRateOverride: null,
    softwareCostMonthly: 800,
    setupCost: 5000,
    trainingCost: 2000,
    description: 'Modern TMS with some OCR — humans still verify everything',
  },
  outsourced: {
    name: 'Outsourced BPO',
    timeMultiplier: 0.9,
    rejectionRateOverride: null,
    softwareCostMonthly: 1200,
    setupCost: 4000,
    trainingCost: 1500,
    description: 'Offshore team reviews documents — slower turnarounds, more rejections',
  },
  ourPlatform: {
    name: 'Our Platform',
    timeMultiplier: 0.35,
    rejectionRateOverride: 4,
    softwareCostMonthly: 397,
    setupCost: 0,
    trainingCost: 0,
    description: 'Built-in validation, smart routing — cut review time and rework in half',
  },
  aiAutomated: {
    name: 'AI Auto-Review',
    timeMultiplier: 0.05,
    rejectionRateOverride: 0.5,
    softwareCostMonthly: 997,
    setupCost: 0,
    trainingCost: 0,
    description: 'End-to-end AI extraction + validation — humans only handle exceptions',
  },
};

export const WORKFLOW_COLORS: Record<string, string> = {
  manual: '#ef4444',
  legacyTms: '#f97316',
  modernTms: '#3b82f6',
  outsourced: '#22c55e',
  ourPlatform: '#8b5cf6',
  aiAutomated: '#f59e0b',
};

export const DEFAULT_INPUTS: CalculatorInputs = {
  docsPerMonth: 400,
  minutesPerDoc: 6,
  employees: 3,
  currentWorkflow: 'manual',
  rejectionRate: 12,
  hourlyWage: 28,
};

export const LOGISTICS_PRESETS: Record<string, { label: string; inputs: Partial<CalculatorInputs> }> = {
  smallBroker: {
    label: 'Small Broker',
    inputs: { docsPerMonth: 250, minutesPerDoc: 5, employees: 2, rejectionRate: 10, hourlyWage: 26 },
  },
  midBroker: {
    label: 'Mid-Size Broker',
    inputs: { docsPerMonth: 600, minutesPerDoc: 6, employees: 5, rejectionRate: 12, hourlyWage: 28 },
  },
  customsBroker: {
    label: 'Customs Broker',
    inputs: { docsPerMonth: 350, minutesPerDoc: 12, employees: 4, rejectionRate: 18, hourlyWage: 34 },
  },
  fleet: {
    label: 'Fleet / 3PL',
    inputs: { docsPerMonth: 1200, minutesPerDoc: 4, employees: 8, rejectionRate: 8, hourlyWage: 24 },
  },
};
