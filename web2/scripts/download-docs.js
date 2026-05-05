const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = process.env.GITHUB_REPOSITORY || 
             (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG ? 
              `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}` : 
              'Gabrielebattimelli/Physlib-Website');
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
    console.warn('⚠️ No completed runs found for DocsArtifact.yml in ' + REPO);
    console.warn('⚠️ Skipping docs download for this build. Please run the workflow manually in GitHub Actions!');
    process.exit(0); // Exit gracefully so Vercel build succeeds without docs
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

  // Move generated _data to data
  const publicDataPath = path.join(__dirname, '../public/_data');
  const dataPath = path.join(__dirname, '../data');
  
  if (fs.existsSync(publicDataPath)) {
    console.log('Moving generated _data files to data directory...');
    const dataFiles = fs.readdirSync(publicDataPath);
    for (const file of dataFiles) {
      fs.copyFileSync(path.join(publicDataPath, file), path.join(dataPath, file));
    }
    // Clean up public/_data so it doesn't get served statically
    fs.rmSync(publicDataPath, { recursive: true, force: true });
    console.log('Data files moved successfully.');
  }

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

  console.log('Fixing documentation header links...');
  function fixLinksInDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        fixLinksInDirectory(fullPath);
      } else if (fullPath.endsWith('.html')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        // Replace the broken Physlib documentation header link with a link to the homepage
        content = content.replace(/<a([^>]*?)href="[^"]*?"([^>]*?)>(\s*Physlib\s+documentation\s*)<\/a>/gi, '<a$1href="/"$2>$3</a>');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
  
  if (fs.existsSync(publicDocsPath)) {
    fixLinksInDirectory(publicDocsPath);
    console.log('Documentation links fixed successfully.');
  }

  console.log('Documentation download and setup complete!');
}

run().catch(err => {
  console.error('Error downloading docs:', err);
  process.exit(1);
});
