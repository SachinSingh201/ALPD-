
export interface DetectionResult {
  plateNumber: string;
  confidence: string;
  vehicleDescription: string;
  region?: string;
}

export interface HistoryItem {
  id: string;
  imageUrl: string;
  result: DetectionResult;
  timestamp: number;
}
