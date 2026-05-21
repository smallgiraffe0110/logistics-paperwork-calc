import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Logistics Paperwork Calculator | Stop Overpaying on Manual Document Review',
  description:
    'See exactly how much your logistics team is losing on manual paperwork. Calculate doc cost, rejection rework, and ROI of automation. Free instant analysis.',
  keywords:
    'logistics paperwork cost, freight document automation, BOL processing cost, customs broker rework, TMS document review',
  openGraph: {
    title: 'Logistics Paperwork Calculator',
    description:
      'See how much your logistics team is losing on manual document review and rework.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
