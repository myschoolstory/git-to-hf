import { ValidationResult } from '../types';

export async function validateGithubUrl(url: string): Promise<ValidationResult> {
  try {
    const regex = /^https:\/\/github\.com\/[\w-]+\/[\w-]+$/;
    if (!regex.test(url)) {
      return { isValid: false, message: 'Invalid GitHub URL format' };
    }

    const response = await fetch(url);
    if (!response.ok) {
      return { isValid: false, message: 'Repository not found or not public' };
    }

    return { isValid: true, message: 'Valid GitHub repository' };
  } catch (error) {
    return { isValid: false, message: 'Error validating GitHub URL' };
  }
}

export async function validateHfToken(token: string): Promise<ValidationResult> {
  try {
    const response = await fetch('https://huggingface.co/api/whoami', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return { isValid: false, message: 'Invalid Hugging Face token' };
    }

    return { isValid: true, message: 'Valid Hugging Face token' };
  } catch (error) {
    return { isValid: false, message: 'Error validating Hugging Face token' };
  }
}

export async function checkRepoAvailability(
  token: string,
  repoName: string
): Promise<ValidationResult> {
  try {
    const response = await fetch(`https://huggingface.co/api/repos/${repoName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 404) {
      return { isValid: true, message: 'Repository name is available' };
    }

    return { isValid: false, message: 'Repository name already taken' };
  } catch (error) {
    return { isValid: false, message: 'Error checking repository availability' };
  }
}