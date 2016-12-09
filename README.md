RESTful HTTP API for Pandoc
===========================
[Pandoc](http://pandoc.org/) is an amazing universal document converter. Unfortunately, it
just has a command-line interface. In this project, we enable the usage of Pandoc via a RESTful HTTP API, 
provide a mapping of Pandoc type identifiers to common [media types](https://en.wikipedia.org/wiki/Media_type), 
and wrap everything in a docker container, so that it can be easily used/deployed.  

**WARNING**: Currently, the docker image is quite big (> 2gb). We will try to make it smaller but it requires a lot of latex dependencies. Due to the size it takes a while to build/download and verify the checksum of the image.


## API
The API only allows POST requests. The data to be converted must be 
passed in the request body. The header field `Content-Type` specifies
the input type and the header field `Accept` specifies the output type.
 
## Media Type Mapping
Since Pandoc uses its own type identifiers for input and output format, we
created a [mapping](media-types.json) between the Pandoc identifiers and
the corresponding media types. For instance, the Pandoc identifier `html` 
maps to the media type `text/html`.
 
The [mapping](media-types.json) is incomplete since there does not exist
a media type for every format supported by Pandoc. Therefore, you can
also use the Pandoc identifiers in `Content-Type` and `Accept` but this
is not compliant with the HTTP specification. To be compliant, we support 
the usage of `application/x.` as a prefix in front of a Pandoc identifier. 
This prefix is the official [media type tree for unregistered types](https://en.wikipedia.org/wiki/Media_type#Unregistered_x._tree).

## Installation with Docker
To simplify the usage of this project, we wrapped everything into a docker
container that can easily be deployed on any machine. 

You can build the image yourself:
```sh
docker build -t dwolters/pandoc-http .
```

Or install it via docker hub:
```sh
docker pull dwolters/pandoc-http
```

Afterwards, you can start the container:
```sh
docker run -d -p 8080:80 --name my-pandoc-http dwolters/pandoc-http
```

Within the container the HTTP API is reachable on port 80. In the command 
above the HTTP API is bound to port 8080 of the docker host.  

You can stop and remove the container if it is not needed anymore:
```sh
docker stop my-pandoc-http
docker rm my-pandoc-http
```

## Installation without Docker
In order to use this project without using the docker container, you first
must install [Pandoc](http://pandoc.org/installing.html) and add it to your [`PATH`](https://en.wikipedia.org/wiki/PATH_(variable)). 
Alternatively, you can set the `PANDOC` env variable to define the location of your pandoc executable., 

Afterwards, clone the repository and switch to the proper directory:
```sh
git clone https://github.com/dwolters/pandoc-http
cd pandoc-http
```

Install the dependencies:
```
npm install
```

And finally, you can start the HTTP API for Pandoc:
```
node server.js
```

The API can run on a different port by setting the PORT environment variable, e.g., on port 8080:
```
PORT=8080 node server.js
```

## Example API Call

Assuming the API listens on port 8080, you can test it by using curl. 
The following command shows how to convert html into markdown using our 
HTTP API for Pandoc:

```
curl -s -H "Content-Type: text/html" -H "Accept: text/markdown" --data "<h1>My Headline</h1>"  http://localhost:8080/
curl -s -H "Content-Type: text/html" -H "Accept: docx" --data "<h1>My Headline</h1>"  http://localhost:8080/ > file.docx
curl -s -H "Content-Type: docx" -H "Accept: text/markdown" --data-binary "@file.docx"  http://localhost:8080/
```

Please note that in this example the pandoc identifier for docx files is used. The correct media type would be `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.

## Acknowledgements
The Dockerfile is partially based on the Dockerfile of [vpetersson's pandoc container](https://github.com/vpetersson/docker-pandoc).
