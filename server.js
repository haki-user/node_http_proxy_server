const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

const PORT = process.env.PORT || 3000

// Create a new HTTP proxy server
const proxy = httpProxy.createProxyServer();

// Create a new HTTP server
const server = http.createServer((req, res) => {
  // Extract the target URL from the query parameters
  const queryObject = url.parse(req.url, true).query;
  const targetUrl = queryObject.url;

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });    
    res.end('Missing target URL in query parameters');
    return;
  }

  // Proxy the incoming request to the target URL
  proxy.web(req, res, { target: targetUrl }, (err) => {
    // Handle proxy errors
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });    
    res.end('Proxy error');
  });
});

// Start the server on port 3000
server.listen(PORT, () => {
  console.log(`Proxy server listening on port ${PORT}`)
});
