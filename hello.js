    // console.log("Hello, World!");
// const math = require('./math');
// console.log(math);
// const {add,sub} = require('./math');
// console.log( "this is value",maths.add(5, 3));console.log( "this is value",maths.sub(5, 3));
const http = require('http');
const server = http.createServer((req, res) => { console.log('new request'); res.end('Hello from the server'); });
myserver.listen(8000,()=>{ console.log("server started at port 8000"); });