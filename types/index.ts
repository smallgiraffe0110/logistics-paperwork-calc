export interface WorkflowProfile {
  name: string;
  timeMultiplier: number;
  rejectionRateOverride: number | null;
  softwareCostMonthly: number;
  setupCost: number;
  trainingCost: number;
  description: string;
}

export interface CalculatorInputs {
  docsPerMonth: number;
  minutesPerDoc: number;
  employees: number;
  currentWorkflow: string;
  rejectionRate: number;
  hourlyWage: number;
}

export interface CalculationResults {
  currentWorkflow: WorkflowProfile;
  currentMonthlyCost: number;
  currentAnnualCost: number;
  currentTotalFirstYearCost: number;
  currentMonthlyHours: number;
  currentReworkHours: number;

  optimizedWorkflow: WorkflowProfile;
  optimizedMonthlyCost: number;
  optimizedAnnualCost: number;
  optimizedTotalFirstYearCost: number;
  optimizedMonthlyHours: number;

  monthlySavings: number;
  annualSavings: number;
  firstYearSavings: number;
  fiveYearSavings: number;

  automatedWorkflow: WorkflowProfile;
  automatedMonthlyCost: number;
  automatedAnnualCost: number;
  automatedAnnualSavings: number;

  totalDocsProcessed: number;
  effectiveDocsCurrent: number;

  breakdownData: CostBreakdown[];
  timelineData: TimelineData[];
}

export interface CostBreakdown {
  workflow: string;
  laborCost: number;
  reworkCost: number;
  softwareCost: number;
  setupCost: number;
  trainingCost: number;
  total: number;
  color: string;
}

export interface TimelineData {
  year: number;
  currentCost: number;
  optimizedCost: number;
  automatedCost: number;
  savings: number;
}

export interface TrackingEvent {
  event: string;
  data?: Record<string, unknown>;
  timestamp: string;
}
