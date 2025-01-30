import { createRepo, uploadFiles } from '@huggingface/hub';
import { TransferOptions, GitHubFile } from './types';

async function getGitHubFiles(url: string): Promise<GitHubFile[]> {
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

export async function transferRepository(
  options: TransferOptions,
  onProgress?: (message: string) => void
): Promise<void> {
  const log = onProgress || console.log;

  // Step 1: Create new repository on Hugging Face
  log('Creating repository on Hugging Face...');
  await createRepo({
    repo: options.repoName,
    token: options.hfToken,
    private: false,
    license: 'apache',
    repoType: 'space'
  });

  // Step 2: Fetch files from GitHub
  log('Fetching files from GitHub...');
  const files = await getGitHubFiles(options.githubUrl);

  // Step 3: Upload files to Hugging Face
  let uploadedCount = 0;
  const totalFiles = files.length;

  for (const file of files) {
    await uploadFiles({
      repo: options.repoName,
      token: options.hfToken,
      files: [{
        path: file.path,
        content: file.content
      }],
      title: `Upload ${file.path}`,
      description: `Transferring ${file.path} from GitHub`
    });
    
    uploadedCount++;
    log(`Uploaded ${uploadedCount}/${totalFiles} files`);
  }

  // Step 4: Update repository metadata
  if (options.description) {
    log('Updating repository description...');
    await fetch(`https://huggingface.co/api/repos/${options.repoName}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${options.hfToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        description: options.description
      })
    });
  }

  log('Repository transfer completed successfully!');
}