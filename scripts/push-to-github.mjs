import { Octokit } from '@octokit/rest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let connectionSettings;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

async function getGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

const OWNER = 'NOBU6477';
const REPO = 'tomo-trip-2025-latest';
const BASE_PATH = path.resolve(__dirname, '..');

// Files and directories to ignore
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.cache',
  '.config',
  '.upm',
  'scripts',
  'attached_assets',
  'data',
  'env',
  '.breakpoints',
  'tmp',
  'temp'
];

function shouldIgnore(filePath) {
  return IGNORE_PATTERNS.some(pattern => filePath.includes(pattern));
}

async function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (shouldIgnore(filePath)) {
      continue;
    }
    
    if (stat.isDirectory()) {
      await getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

async function uploadFiles() {
  try {
    const octokit = await getGitHubClient();
    const files = await getAllFiles(BASE_PATH);
    
    console.log(`📁 Found ${files.length} files to upload`);
    
    // Create initial commit with README
    const readmePath = path.join(BASE_PATH, 'README.md');
    const readmeContent = fs.readFileSync(readmePath, 'utf8');
    
    await octokit.rest.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: 'README.md',
      message: 'Initial commit: Add README',
      content: Buffer.from(readmeContent).toString('base64'),
    });
    
    console.log('✅ README.md uploaded');
    
    // Upload other files in batches
    let uploaded = 1;
    for (const file of files) {
      if (file.endsWith('README.md')) continue;
      
      const relativePath = path.relative(BASE_PATH, file);
      const content = fs.readFileSync(file);
      
      try {
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: OWNER,
          repo: REPO,
          path: relativePath,
          message: `Add ${relativePath}`,
          content: content.toString('base64'),
        });
        
        uploaded++;
        console.log(`✅ [${uploaded}/${files.length}] ${relativePath}`);
        
        // Rate limiting: wait between uploads
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Failed to upload ${relativePath}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Upload complete! ${uploaded}/${files.length} files uploaded`);
    console.log(`🔗 Repository: https://github.com/${OWNER}/${REPO}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

uploadFiles().catch(console.error);
