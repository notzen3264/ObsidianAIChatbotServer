const fetch = require('node-fetch');
const express = require('express');
const app = express();

const targetUrl = 'https://obsidian-ai-chatbot.netlify.app/.netlify/functions/chat';
const messagesPerBatch = 25;
const requestIntervalMs = 250;

function generatePayload(i) {
  return { message: `Hello from request ${i}` };
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

setInterval(sendBatchRequests, requestIntervalMs);

const htmlPage = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Obsidian AI Chatbot Server</title>
  <style>
    body {
      background: linear-gradient(120deg, #1f1c2c, #928dab);
      color: #fff;
      font-family: 'Segoe UI', sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
    }
    .container {
      text-align: center;
    }
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Obsidian AI Chatbot Server is Running</h1>
    <p>High-speed request loop in progress.</p>
  </div>
</body>
</html>
`;

app.get('/', (req, res) => res.send(htmlPage));
app.listen(8000, () => {
  console.log("Web interface live at http://localhost:8000");
});
