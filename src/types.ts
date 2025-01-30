export interface TransferFormData {
  githubUrl: string;
  hfToken: string;
  repoName: string;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export interface TransferStatus {
  status: 'idle' | 'validating' | 'transferring' | 'success' | 'error';
  message: string;
}