export interface TransferOptions {
  githubUrl: string;
  hfToken: string;
  repoName: string;
  description?: string;
}

export interface GitHubFile {
  path: string;
  content: string;
}