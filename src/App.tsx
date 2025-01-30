import React from 'react';
import { TransferForm } from './components/TransferForm';
import { TransferFormData } from './types';
import { GitBranch } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { createRepo, uploadFiles } from '@huggingface/hub';

async function getGitHubFiles(url: string): Promise<{ path: string; content: string }[]> {
  const [, owner, repo] = url.match(/github\.com\/([^/]+)\/([^/]+)/) || [];
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`;
  
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error('Failed to fetch repository structure');
  }
  
  const data = await response.json();
  const files = await Promise.all(
    data.tree
      .filter((item: { type: string }) => item.type === 'blob')
      .map(async (file: { path: string; url: string }) => {
        const contentResponse = await fetch(file.url);
        const contentData = await contentResponse.json();
        const content = atob(contentData.content);
        return { path: file.path, content };
      })
  );
  
  return files;
}

function App() {
  const handleTransfer = async (data: TransferFormData) => {
    try {
      // Step 1: Create new repository on Hugging Face
      await createRepo({
        repo: data.repoName,
        token: data.hfToken,
        private: false,
        license: 'apache',
        repoType: 'space'
      });
      
      toast.success('Repository created on Hugging Face');

      // Step 2: Fetch files from GitHub
      const files = await getGitHubFiles(data.githubUrl);
      toast.success('Files fetched from GitHub');

      // Step 3: Upload files to Hugging Face
      let uploadedCount = 0;
      const totalFiles = files.length;

      for (const file of files) {
        await uploadFiles({
          repo: data.repoName,
          token: data.hfToken,
          files: [{
            path: file.path,
            content: file.content
          }],
          title: `Upload ${file.path}`,
          description: `Transferring ${file.path} from GitHub`
        });
        
        uploadedCount++;
        toast.success(`Uploaded ${uploadedCount}/${totalFiles} files`);
      }

      // Step 4: Update repository metadata
      if (data.description) {
        await fetch(`https://huggingface.co/api/repos/${data.repoName}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${data.hfToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            description: data.description
          })
        });
      }

      toast.success('Repository transfer completed successfully!');
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to transfer repository');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <GitBranch className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-3 text-3xl font-extrabold text-gray-900">
            GitHub to Hugging Face Transfer
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Transfer your public GitHub repositories to Hugging Face Hub
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <TransferForm onSubmit={handleTransfer} />
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;