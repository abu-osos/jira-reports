// /api/jira/myself.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch'; // You might need to install this: npm install node-fetch

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Ensure this function only handles GET requests for this example
  if (request.method !== 'GET') {
    response.setHeader('Allow', ['GET']);
    return response.status(405).end('Method Not Allowed');
  }

  const jiraBaseUrl = process.env['JIRA_BASE_URL'];
  const jiraApiToken = process.env['JIRA_API_TOKEN'];
  // It's good practice to also have your Jira email as an environment variable for Basic Auth
  const jiraEmail = process.env['JIRA_EMAIL']; // Example: 'your-email@example.com'

  if (!jiraBaseUrl || !jiraApiToken || !jiraEmail) {
    console.error('Jira environment variables are not set.');
    return response.status(500).json({ error: 'Server configuration error.' });
  }

  // Construct the Authorization header for Jira (Basic Auth is generally preferred for server-to-server)
  const authHeader = `Basic ${Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString('base64')}`;

  try {
    const jiraApiResponse = await fetch(`${jiraBaseUrl}/rest/api/3/myself`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    });

    if (!jiraApiResponse.ok) {
      // Forward Jira's error status and body if possible
      const errorBody = await jiraApiResponse.text(); // Use .text() as error might not be JSON
      console.error(`Jira API Error (${jiraApiResponse.status}): ${errorBody}`);
      return response.status(jiraApiResponse.status).json({
        message: `Error from Jira API: ${jiraApiResponse.statusText}`,
        details: errorBody,
      });
    }

    const data = await jiraApiResponse.json();
    return response.status(200).json(data);
  } catch (error: any) {
    console.error('Error calling Jira API:', error);
    return response.status(500).json({ error: 'Failed to fetch data from Jira.', details: error.message });
  }
} 