const fs = require('fs');
const path = require('path');

// Ensure the environments directory exists
const envDir = path.join(__dirname, 'src/environments');
if (!fs.existsSync(envDir)) {
  fs.mkdirSync(envDir, { recursive: true });
}

const targetPath = path.join(envDir, 'environment.prod.ts');

// Fetch the environment variables. Make sure these are set in your Vercel project settings.
const jiraUsername = process.env.JIRA_USERNAME;
const jiraPassword = process.env.JIRA_PASSWORD;

// It's a good practice to ensure the variables are actually set in Vercel
if (!jiraUsername || !jiraPassword) {
  console.warn(
    `Warning: JIRA_USERNAME or JIRA_PASSWORD environment variables are not set in Vercel. ` +
    `The application might not work as expected in production.`
  );
}

const envConfigFile = `
export const environment = {
  production: true,
  jiraUrl: '${process.env.JIRA_URL || 'https://gearsjira.atlassian.net'}', // Example: also from Vercel or default
  jiraApiToken: '${process.env.JIRA_API_TOKEN || ''}',          // Example: also from Vercel or default
  JIRA_USERNAME: '${jiraUsername || ""}',
  JIRA_PASSWORD: '${jiraPassword || ""}'
};
`;

fs.writeFile(targetPath, envConfigFile, (err) => {
  if (err) {
    console.error('Error writing Angular environment.prod.ts file:', err);
    throw err;
  } else {
    console.log(`Angular environment.prod.ts file generated successfully at ${targetPath} with Vercel variables.`);
  }
}); 