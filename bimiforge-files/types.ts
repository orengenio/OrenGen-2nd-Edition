export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlight: boolean;
  badge?: string;
}

export interface ComparisonRow {
  tool: string;
  function: string;
  input: string;
  output: string;
  price: string;
  type: string;
  limit: string;
  verdict: string;
  isWinner?: boolean;
}