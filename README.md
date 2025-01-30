# GitHub to Hugging Face Transfer

A modern web application that simplifies the process of transferring public GitHub repositories to Hugging Face Hub. Built with React, TypeScript, and Tailwind CSS.

![GitHub to Hugging Face Transfer](https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1200&h=400)

## Features

- 🔄 One-click repository transfer from GitHub to Hugging Face
- ✅ Comprehensive validation of inputs
- 🔒 Secure API token handling
- 📝 Optional repository description
- 🚀 Real-time progress updates
- ⚡ Fast and efficient file transfer
- 🎨 Modern, responsive UI

## Prerequisites

- A public GitHub repository
- A Hugging Face account and API token
- Node.js 18 or higher

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Enter your GitHub repository URL
2. Paste your Hugging Face API token
3. Specify the target repository name for Hugging Face
4. (Optional) Add a description for your repository
5. Click "Transfer Repository" and wait for the process to complete

## Technical Details

The application performs several steps during the transfer process:

1. **Validation**
   - Verifies GitHub URL format and repository accessibility
   - Validates Hugging Face API token
   - Checks target repository name availability

2. **Transfer Process**
   - Creates a new repository on Hugging Face Hub
   - Fetches all files from the GitHub repository
   - Uploads files to Hugging Face
   - Updates repository metadata

## Limitations

- Only supports repositories on the 'main' branch
- Binary files are not supported
- Large repositories might be affected by API rate limits
- Sequential file transfer might be slow for large repositories

## Security

- API tokens are never stored
- All operations are performed client-side
- HTTPS-only API communication
- Input validation and sanitization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
