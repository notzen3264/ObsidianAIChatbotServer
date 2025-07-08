const fetch = require('node-fetch');

// Configurable parameters
const targetUrl = 'https://obsidian-ai-chatbot.netlify.app/.netlify/functions/chat';
const messagesPerBatch = 50;  // Number of requests per cycle
const requestIntervalMs = 1;  // Every 1 millisecond

function generatePayload(i) {
  return {
    message: `Hello from request ${i}`
  };
}

async function sendBatchRequests() {
  const requests = Array.from({ length: messagesPerBatch }, (_, i) =>
    fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generatePayload(i))
    }).then(res => res.json())
      .catch(err => ({ error: err.message }))
  );

  const results = await Promise.all(requests);
  console.log(`Batch complete:`, results);
}

// Launch rapid-fire request loop
setInterval(sendBatchRequests, requestIntervalMs);
