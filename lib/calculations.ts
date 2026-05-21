import {
  CalculatorInputs,
  CalculationResults,
  CostBreakdown,
  TimelineData,
  WorkflowProfile,
} from '@/types';
import { WORKFLOWS, WORKFLOW_COLORS } from './constants';

interface WorkflowCosts {
  effectiveMinutesPerDoc: number;
  rejectionPct: number;
  baseMinutes: number;
  reworkMinutes: number;
  monthlyHours: number;
  reworkHours: number;
  laborCost: number;
  reworkCost: number;
  monthlyCost: number;
  annualCost: number;
  firstYearCost: number;
}

function computeWorkflowCosts(
  profile: WorkflowProfile,
  docsPerMonth: number,
  minutesPerDoc: number,
  hourlyWage: number,
  userRejectionRate: number,
): WorkflowCosts {
  const effectiveMinutesPerDoc = minutesPerDoc * profile.timeMultiplier;
  const rejectionPct =
    profile.rejectionRateOverride !== null ? profile.rejectionRateOverride : userRejectionRate;

  const baseMinutes = docsPerMonth * effectiveMinutesPerDoc;
  const reworkMinutes = baseMinutes * (rejectionPct / 100);
  const monthlyHours = (baseMinutes + reworkMinutes) / 60;
  const reworkHours = reworkMinutes / 60;

  const laborCost = (baseMinutes / 60) * hourlyWage;
  const reworkCost = (reworkMinutes / 60) * hourlyWage;

  const monthlyCost = laborCost + reworkCost + profile.softwareCostMonthly;
  const annualCost = monthlyCost * 12;
  const firstYearCost = annualCost + profile.setupCost + profile.trainingCost;

  return {
    effectiveMinutesPerDoc,
    rejectionPct,
    baseMinutes,
    reworkMinutes,
    monthlyHours,
    reworkHours,
    laborCost,
    reworkCost,
    monthlyCost,
    annualCost,
    firstYearCost,
  };
}

export function calculateCosts(inputs: CalculatorInputs): CalculationResults {
  const { docsPerMonth, minutesPerDoc, employees, currentWorkflow, rejectionRate, hourlyWage } =
    inputs;

  const current = WORKFLOWS[currentWorkflow] ?? WORKFLOWS.manual;
  const optimized = WORKFLOWS.ourPlatform;
  const automated = WORKFLOWS.aiAutomated;

  const currentCosts = computeWorkflowCosts(
    current,
    docsPerMonth,
    minutesPerDoc,
    hourlyWage,
    rejectionRate,
  );
  const optimizedCosts = computeWorkflowCosts(
    optimized,
    docsPerMonth,
    minutesPerDoc,
    hourlyWage,
    rejectionRate,
  );
  const automatedCosts = computeWorkflowCosts(
    automated,
    docsPerMonth,
    minutesPerDoc,
    hourlyWage,
    rejectionRate,
  );

  const monthlySavings = (currentCosts.monthlyCost - optimizedCosts.monthlyCost) * employees;
  const annualSavings = (currentCosts.annualCost - optimizedCosts.annualCost) * employees;
  const firstYearSavings =
    (currentCosts.firstYearCost - optimizedCosts.firstYearCost) * employees;
  const fiveYearSavings =
    annualSavings * 5 + (current.setupCost + current.trainingCost) * employees;

  const automatedAnnualSavings =
    (currentCosts.annualCost - automatedCosts.annualCost) * employees;

  const totalDocsProcessed = docsPerMonth * employees;
  const effectiveDocsCurrent = totalDocsProcessed * (1 + currentCosts.rejectionPct / 100);

  const breakdownData: CostBreakdown[] = [
    {
      workflow: current.name,
      laborCost: currentCosts.laborCost,
      reworkCost: currentCosts.reworkCost,
      softwareCost: current.softwareCostMonthly,
      setupCost: current.setupCost,
      trainingCost: current.trainingCost,
      total: currentCosts.monthlyCost,
      color: WORKFLOW_COLORS[currentWorkflow] || '#6b7280',
    },
    {
      workflow: optimized.name,
      laborCost: optimizedCosts.laborCost,
      reworkCost: optimizedCosts.reworkCost,
      softwareCost: optimized.softwareCostMonthly,
      setupCost: optimized.setupCost,
      trainingCost: optimized.trainingCost,
      total: optimizedCosts.monthlyCost,
      color: WORKFLOW_COLORS.ourPlatform,
    },
    {
      workflow: automated.name,
      laborCost: automatedCosts.laborCost,
      reworkCost: automatedCosts.reworkCost,
      softwareCost: automated.softwareCostMonthly,
      setupCost: automated.setupCost,
      trainingCost: automated.trainingCost,
      total: automatedCosts.monthlyCost,
      color: WORKFLOW_COLORS.aiAutomated,
    },
  ];

  const timelineData: TimelineData[] = [];
  for (let year = 1; year <= 5; year++) {
    const currentCost =
      (currentCosts.annualCost * year + current.setupCost + current.trainingCost) * employees;
    const optimizedCost =
      (optimizedCosts.annualCost * year + optimized.setupCost + optimized.trainingCost) *
      employees;
    const automatedCost =
      (automatedCosts.annualCost * year + automated.setupCost + automated.trainingCost) *
      employees;

    timelineData.push({
      year,
      currentCost,
      optimizedCost,
      automatedCost,
      savings: currentCost - optimizedCost,
    });
  }

  return {
    currentWorkflow: current,
    currentMonthlyCost: currentCosts.monthlyCost,
    currentAnnualCost: currentCosts.annualCost,
    currentTotalFirstYearCost: currentCosts.firstYearCost,
    currentMonthlyHours: currentCosts.monthlyHours,
    currentReworkHours: currentCosts.reworkHours,

    optimizedWorkflow: optimized,
    optimizedMonthlyCost: optimizedCosts.monthlyCost,
    optimizedAnnualCost: optimizedCosts.annualCost,
    optimizedTotalFirstYearCost: optimizedCosts.firstYearCost,
    optimizedMonthlyHours: optimizedCosts.monthlyHours,

    monthlySavings,
    annualSavings,
    firstYearSavings,
    fiveYearSavings,

    automatedWorkflow: automated,
    automatedMonthlyCost: automatedCosts.monthlyCost,
    automatedAnnualCost: automatedCosts.annualCost,
    automatedAnnualSavings,

    totalDocsProcessed,
    effectiveDocsCurrent,

    breakdownData,
    timelineData,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function formatHours(value: number): string {
  return `${Math.round(value).toLocaleString()} hrs`;
}
