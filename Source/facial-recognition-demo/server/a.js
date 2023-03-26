const express = require('express');
const https = require('https');
const fs = require('fs');

const app = express();

const options = {
  key: fs.readFileSync('/path/to/private/key/file'),
  cert: fs.readFileSync('/path/to/certificate/file')
};

const server = https.createServer(options, app);

app.use((req, res, next) => {
  if (req.secure) {
    // request was via https, so do not redirect
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

server.listen(443, () => {
  console.log('Server listening on port 443');
});