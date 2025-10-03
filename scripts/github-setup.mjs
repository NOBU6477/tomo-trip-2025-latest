import { Octokit } from '@octokit/rest';

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

async function createRepository() {
  try {
    const octokit = await getGitHubClient();
    
    // Get authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    console.log(`✅ Authenticated as: ${user.login}`);
    
    // Create repository
    const { data: repo } = await octokit.rest.repos.createForAuthenticatedUser({
      name: 'tomo-trip-2025-latest',
      description: 'TomoTrip - Bilingual (Japanese/English) local guide matching platform connecting tourists with authentic local experiences',
      private: false,
      auto_init: false
    });
    
    console.log(`✅ Repository created: ${repo.html_url}`);
    console.log(`✅ Clone URL: ${repo.clone_url}`);
    console.log(`✅ SSH URL: ${repo.ssh_url}`);
    
    return {
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      sshUrl: repo.ssh_url,
      owner: user.login
    };
  } catch (error) {
    console.error('❌ Error creating repository:', error.message);
    if (error.status === 422) {
      console.error('Repository might already exist. Please check your GitHub account.');
    }
    throw error;
  }
}

createRepository().catch(console.error);
