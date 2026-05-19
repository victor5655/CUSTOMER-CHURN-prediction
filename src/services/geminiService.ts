import { CustomerData } from "../data/churnData";

export interface PredictionResult {
  riskScore: number; // 0-100
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  behavioralPersona: string;
  topFactors: {
    factor: string;
    impact: 'Negative' | 'Positive';
    explanation: string;
  }[];
  retentionStrategy: string;
  summary: string;
}

export async function predictChurn(customer: CustomerData): Promise<PredictionResult> {
  const response = await fetch("/api/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customer }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch prediction from server.");
  }

  return response.json();
}
