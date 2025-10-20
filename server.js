const http = require('http');
const server = http.createServer((req, res) => { console.log('new request'); res.end('Hello from the server'); });
myserver.listen(8000,()=>{ console.log("server started at port 8000"); });