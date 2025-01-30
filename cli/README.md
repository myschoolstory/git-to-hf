# GitHub to Hugging Face CLI

A command-line interface for transferring public GitHub repositories to Hugging Face Hub.

## Installation

```bash
npm install -g gh-to-hf
```

## Usage

### Command Line

```bash
gh-to-hf --github https://github.com/user/repo \
         --token your-hf-token \
         --repo user/new-repo \
         --description "Optional description"
```

### Programmatic Usage

```typescript
import { transferRepository } from 'gh-to-hf';

await transferRepository({
  githubUrl: 'https://github.com/user/repo',
  hfToken: 'your-hf-token',
  repoName: 'user/new-repo',
  description: 'Optional description'
});
```

## Options

- `-g, --github <url>`: GitHub repository URL (required)
- `-t, --token <token>`: Hugging Face API token (required)
- `-r, --repo <name>`: Target repository name on Hugging Face (required)
- `-d, --description <text>`: Repository description (optional)

## Features

- 🔄 Easy repository transfer
- ✅ Input validation
- 🔒 Secure token handling
- 📝 Optional descriptions
- 🚀 Progress indicators
- ⚡ Efficient file transfer

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Link for local development:
   ```bash
   npm link
   ```

## License

Apache License 2.0