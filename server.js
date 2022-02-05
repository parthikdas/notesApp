const http = require('http')
const fs = require('fs')

http.createServer((req, res) => {
    if(req.url === '/data') {
        if(req.method === 'POST') {
            let writeStream = fs.createWriteStream(__dirname+'/data.txt')
            req.pipe(writeStream)
        } else if(req.method === 'GET') {
            const stream = fs.createReadStream(__dirname + '/data.txt')
            stream.pipe(res)
        }
    } else {
        let fileName = '.' + (req.url === '/' ? '/index.html' : req.url)
        const stream = fs.createReadStream(fileName)
        stream.pipe(res)
    }
})
.listen(3000, console.log('server running at http://localhost:3000'))