export interface CryAnalysisResult {
  primaryReason: string;
  confidenceScore: number;
  emotionalState: string;
  actionableSteps: string[];
  medicalDisclaimer: string;
  analysisContext: string;
  chartData: { name: string; value: number }[];
}

export interface UserProfileData {
  parentName: string;
  babyName: string;
  gender: 'boy' | 'girl' | 'prefer_not_to_say';
  birthDate: string;
}

export interface HistoryItem extends CryAnalysisResult {
  id: string;
  date: Date;
}
