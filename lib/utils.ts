import { CalculatorInputs } from '@/types';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function encodeInputsToParams(inputs: CalculatorInputs): string {
  const params = new URLSearchParams({
    d: inputs.docsPerMonth.toString(),
    m: inputs.minutesPerDoc.toString(),
    e: inputs.employees.toString(),
    w: inputs.currentWorkflow,
    r: inputs.rejectionRate.toString(),
    h: inputs.hourlyWage.toString(),
  });
  return params.toString();
}

export function decodeParamsToInputs(searchParams: URLSearchParams): Partial<CalculatorInputs> {
  const result: Partial<CalculatorInputs> = {};

  const d = searchParams.get('d');
  if (d) result.docsPerMonth = Number(d);

  const m = searchParams.get('m');
  if (m) result.minutesPerDoc = Number(m);

  const e = searchParams.get('e');
  if (e) result.employees = Number(e);

  const w = searchParams.get('w');
  if (w) result.currentWorkflow = w;

  const r = searchParams.get('r');
  if (r !== null) result.rejectionRate = Number(r);

  const h = searchParams.get('h');
  if (h) result.hourlyWage = Number(h);

  return result;
}

export function trackEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;

  fetch('/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, data, timestamp: new Date().toISOString() }),
  }).catch(() => {
    // Silently fail analytics
  });
}
