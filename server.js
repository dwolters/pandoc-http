const http = require('http');
const pdc = require('pdc');
const mediaTypeConverter = require('./mediatype-converter');

const port = 80;

function handleRequest(req, res) {
    if (req.method !== 'POST') {
        res.statusCode = 400;
        res.statusMessage = 'Bad Request';
        res.end('Only POST is supported');
    } else {
        var inputType = mediaTypeConverter(req.headers['content-type']);
        var outputMediaType = req.headers['accept'];
        var pandocOutputType = mediaTypeConverter(req.headers['accept']);
        console.log('Pandoc input type: ', inputType);
        console.log('Pandoc output type: ', pandocOutputType);
        var body = [];
        req.on('data', chunk => body.push(chunk))
        .on('end', () => {
            var data = Buffer.concat(body).toString();
            console.log('Input data: ', data);
            pdc(data, inputType, pandocOutputType, (err, result) => {
                if (err) {
                    res.statusCode = 500;
                    res.statusMessage = 'Internal Server Error';
                    res.end(res.statusMessage);
                    console.error('Error during conversion: ', err);
                } else {
                    res.setHeader('Content-Type', outputMediaType);
                    res.end(result);
                    console.log('Output data', result);
                }
            });
        });
    }
}

let server = http.createServer(handleRequest);

server.listen(process.env.PORT || port, () => console.log('Server started'));