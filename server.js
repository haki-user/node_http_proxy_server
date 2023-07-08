const express = require('express');
// const request = require('request');
const axios = require('axios');
const url = require('url');
const qs = require('qs');
const path = require('path');

const app = express();

app.use(express.json());

const getData = async (url) => {
    try {
        const res = await axios(url);
        const data = res.data;
        // console.log(data);
        return data;
    } catch (err) {
        // console.log(err);
        console.log('error', url);
    } 
}

const { URL } = require('url');

app.get('/:url(*)', async (req, res) => {
    console.log("req");
    try {
      let url = req.params.url; // Retrieve the URL parameter
      url = url.replace(/^"(.*)"$/, '$1'); // Remove quotes from the URL
  
      const response = await axios.get(url, {
        responseType: 'arraybuffer' // Set the response type to arraybuffer to handle binary files
      });
  
      const contentType = response.headers['content-type'];
      const fileExtension = path.extname(url).substring(1); // Extract the file extension
  
      // Set the appropriate content type header
      res.set('Content-Type', contentType);
  
      // Forward the binary response to the client
      res.send(Buffer.from(response.data, 'binary'));
    } catch (error) {
      // Handle any errors that occurred during the request
      res.status(500).send('Error fetching resource');
    }
  });

  
  

app.listen(3000, () => {
    console.log('3000');
});





// const http = require('http');
// const httpProxy = require('http-proxy');
// const url = require('url');

// const PORT = process.env.PORT || 3000

// // Create a new HTTP proxy server
// const proxy = httpProxy.createProxyServer();

// // Create a new HTTP server
// const server = http.createServer((req, res) => {
//   // Extract the target URL from the query parameters
//   const queryObject = url.parse(req.url, true).query;
//   const targetUrl = queryObject.url;

//   if (!targetUrl) {
//     res.writeHead(400, { 'Content-Type': 'text/plain' });    
//     res.end('Missing target URL in query parameters');
//     return;
//   }

//   // Proxy the incoming request to the target URL
//   proxy.web(req, res, { target: targetUrl }, (err) => {
//     // Handle proxy errors
//     console.error('Proxy error:', err);
//     res.writeHead(500, { 'Content-Type': 'text/plain' });    
//     res.end('Proxy error');
//   });
// });

// // Start the server on port 3000
// server.listen(PORT, () => {
//   console.log(`Proxy server listening on port ${PORT}`)
// });
