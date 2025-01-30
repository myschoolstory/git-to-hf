import React, { useState } from 'react';
import { Github, Box, Upload } from 'lucide-react';
import { TransferFormData, TransferStatus } from '../types';
import {
  validateGithubUrl,
  validateHfToken,
  checkRepoAvailability,
} from '../utils/validation';

interface Props {
  onSubmit: (data: TransferFormData) => Promise<void>;
}

export function TransferForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState<TransferFormData>({
    githubUrl: '',
    hfToken: '',
    repoName: '',
    description: '',
  });

  const [status, setStatus] = useState<TransferStatus>({
    status: 'idle',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ status: 'validating', message: 'Validating inputs...' });

    try {
      // Validate GitHub URL
      const githubValidation = await validateGithubUrl(formData.githubUrl);
      if (!githubValidation.isValid) {
        setStatus({ status: 'error', message: githubValidation.message });
        return;
      }

      // Validate Hugging Face token
      const tokenValidation = await validateHfToken(formData.hfToken);
      if (!tokenValidation.isValid) {
        setStatus({ status: 'error', message: tokenValidation.message });
        return;
      }

      // Check repository name availability
      const availabilityCheck = await checkRepoAvailability(
        formData.hfToken,
        formData.repoName
      );
      if (!availabilityCheck.isValid) {
        setStatus({ status: 'error', message: availabilityCheck.message });
        return;
      }

      setStatus({ status: 'transferring', message: 'Starting transfer...' });
      await onSubmit(formData);
    } catch (error) {
      setStatus({
        status: 'error',
        message: 'An error occurred during validation',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="githubUrl"
          className="block text-sm font-medium text-gray-700"
        >
          GitHub Repository URL
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Github className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="githubUrl"
            id="githubUrl"
            required
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="https://github.com/username/repository"
            value={formData.githubUrl}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="hfToken"
          className="block text-sm font-medium text-gray-700"
        >
          Hugging Face API Token
        </label>
        <div className="mt-1">
          <input
            type="password"
            name="hfToken"
            id="hfToken"
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="hf_..."
            value={formData.hfToken}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="repoName"
          className="block text-sm font-medium text-gray-700"
        >
          Target Repository Name
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Box className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            name="repoName"
            id="repoName"
            required
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="username/repository-name"
            value={formData.repoName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Repository Description
        </label>
        <div className="mt-1">
          <textarea
            name="description"
            id="description"
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Optional description for the repository"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={status.status === 'validating' || status.status === 'transferring'}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
        >
          {status.status === 'validating' || status.status === 'transferring' ? (
            <span className="flex items-center">
              <Upload className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
              {status.message}
            </span>
          ) : (
            'Transfer Repository'
          )}
        </button>
      </div>

      {status.status === 'error' && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{status.message}</div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}