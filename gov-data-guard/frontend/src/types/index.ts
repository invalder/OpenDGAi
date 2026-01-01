export type UserRole = 'viewer' | 'editor' | 'admin' | 'dpo';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  orgId?: string;
}

export type Visibility = 'public' | 'restricted' | 'confidential';
export type PDPAStatus = 'pending' | 'scanning' | 'approved' | 'rejected';

export interface DCATMetadata {
  publisher?: string;
  issued?: string;
  modified?: string;
  license?: string;
  keywords?: string[];
}

export interface Dataset {
  id: string;
  title: string;
  description: string;
  owner: string;
  visibility: Visibility;
  pdpaStatus: PDPAStatus;
  metadata?: DCATMetadata;
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  fileUrl?: string;
  format?: 'csv' | 'json' | 'xml';
  ckanId?: string;
  ckanUrl?: string;
  lastSynced?: string;
}

export interface PIIFinding {
  type: string;
  count: number;
}

export interface ScanResult {
  datasetId: string;
  riskScore: number;
  findings: PIIFinding[];
  scannedAt: string;
}
