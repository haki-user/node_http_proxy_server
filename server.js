const express = require('express');
const axios = require('axios');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// const cookieParser = require('cookie-parser')
// const url = require('url');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());

// app.use(cookieParser());

// app.use(session({
//   secret: 'your-secret-key', // Secret key used for session encryption
//   resave: false,
//   saveUninitialized: true,
//   originalMaxAge:'3600000'
// }));

// let i = 0;
// const users = [];


// Route to handle requests for any resource
app.get('/:url(*)', async (req, res) => {
    let absoluteUrl;
  try {

    // console.log(req.session.originalUrl);
    let urlParam = req.params.url; // Retrieve the URL parameter
    urlParam = urlParam.replace(/^"(.*)"$/, '$1'); // Remove quotes from the URL

    if (urlParam.startsWith('http://') || urlParam.startsWith('https://')) {
      absoluteUrl = urlParam;
      if(!req.cookies || !req.cookies.originalUrl){
        res.cookie('originalUrl', absoluteUrl, { maxAge: 3600000 });
      }
    } else {
      // Handle relative URLs
      absoluteUrl = new URL(urlParam, req.cookies.originalUrl).href;
    }
    
    if(absoluteUrl[0] === '/') abosoluteUrl.splice(0, 1);
    
    const response = await axios.get(absoluteUrl, {
      responseType: 'arraybuffer' // Set the response type to arraybuffer to handle binary files
    });

    const contentType = response.headers['content-type'];

    // Set the appropriate content type header
    res.set('Content-Type', contentType);

    // Forward the binary response to the client
    res.send(Buffer.from(response.data, 'binary'));
  } catch (error) {
    // Handle any errors that occurred during the request
    res.status(500).send('Error fetching resource', absoluteUrl);
  }
});

app.get('/', (req, res) => {
    req.clearCookie('originalUrl');
    res.send(`<a link='http://ipinfo.io'>ip loc</a>`);
});

// Start the server
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
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
