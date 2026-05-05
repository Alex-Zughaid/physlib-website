const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = process.env.GITHUB_REPOSITORY || 'leanprover-community/physlib';
const TOKEN = process.env.GITHUB_TOKEN;

if (!TOKEN) {
  console.warn('⚠️ GITHUB_TOKEN is missing. Skipping docs download. If deploying to production, docs will be missing!');
  process.exit(0);
}

const headers = {
  'User-Agent': 'Node.js/Physlib-Docs-Fetcher',
  'Authorization': `token ${TOKEN}`,
  'Accept': 'application/vnd.github.v3+json'
};

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function downloadZip(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers }, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', reject);
  });
}

async function run() {
  console.log('Fetching latest workflow run for DocsArtifact.yml...');
  const runsData = await fetchJson(`https://api.github.com/repos/${REPO}/actions/workflows/DocsArtifact.yml/runs?status=completed&per_page=1`);
  
  if (!runsData.workflow_runs || runsData.workflow_runs.length === 0) {
    console.error('No completed runs found for DocsArtifact.yml');
    process.exit(1);
  }

  const runId = runsData.workflow_runs[0].id;
  console.log(`Found run ID: ${runId}`);

  console.log('Fetching artifacts for run...');
  const artifactsData = await fetchJson(`https://api.github.com/repos/${REPO}/actions/runs/${runId}/artifacts`);
  
  const docArtifact = artifactsData.artifacts.find(a => a.name === 'documentation');
  if (!docArtifact) {
    console.error('Documentation artifact not found in the latest run.');
    process.exit(1);
  }

  console.log(`Found artifact ID: ${docArtifact.id}. Downloading...`);
  const zipPath = path.join(__dirname, '../doc-artifact.zip');
  await downloadZip(docArtifact.archive_download_url, zipPath);
  
  console.log('Download complete. Extracting...');
  const publicDocsPath = path.join(__dirname, '../public/docs');
  
  // Clean old docs directory
  if (fs.existsSync(publicDocsPath)) {
    fs.rmSync(publicDocsPath, { recursive: true, force: true });
  }
  
  // Create public directory if it doesn't exist
  if (!fs.existsSync(path.join(__dirname, '../public'))) {
    fs.mkdirSync(path.join(__dirname, '../public'));
  }

  // Use system unzip
  try {
    execSync(`unzip -q ${zipPath} -d ${path.join(__dirname, '../public')}`);
  } catch (err) {
    console.error('Error unzipping artifact. Is unzip installed?', err);
    process.exit(1);
  }
  
  fs.unlinkSync(zipPath); // clean up zip

  console.log('Applying custom CSS theme...');
  const themeCssPath = path.join(__dirname, '../public/docs-theme.css');
  const targetCssPath = path.join(publicDocsPath, 'style.css');

  if (fs.existsSync(themeCssPath) && fs.existsSync(targetCssPath)) {
    const themeCss = fs.readFileSync(themeCssPath, 'utf8');
    fs.appendFileSync(targetCssPath, '\n/* --- PHYSLIB CUSTOM THEME --- */\n' + themeCss);
    console.log('Custom CSS applied successfully.');
  } else {
    console.warn('Could not find docs-theme.css or style.css to apply overrides.');
  }

  console.log('Documentation download and setup complete!');
}

run().catch(err => {
  console.error('Error downloading docs:', err);
  process.exit(1);
});
