import { TransferOptions } from './types';

export async function validateInputs(options: TransferOptions): Promise<void> {
  // Validate GitHub URL
  const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
  if (!githubRegex.test(options.githubUrl)) {
    throw new Error('Invalid GitHub URL format');
  }

  // Check if repository exists and is public
  const response = await fetch(options.githubUrl);
  if (!response.ok) {
    throw new Error('Repository not found or not public');
  }

  // Validate Hugging Face token
  const hfResponse = await fetch('https://huggingface.co/api/whoami', {
    headers: { Authorization: `Bearer ${options.hfToken}` }
  });

  if (!hfResponse.ok) {
    throw new Error('Invalid Hugging Face token');
  }

  // Check if target repository name is available
  const repoResponse = await fetch(`https://huggingface.co/api/repos/${options.repoName}`, {
    headers: { Authorization: `Bearer ${options.hfToken}` }
  });

  if (repoResponse.ok) {
    throw new Error('Repository name already taken on Hugging Face');
  }
}