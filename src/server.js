const http = require('http');
const url = require('url');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// url struct for checking requests
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCss,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/unauthorized': responseHandler.getUnauthorized,
  '/forbidden': responseHandler.getForbidden,
  '/internal': responseHandler.getInternalError,
  '/notImplemented': responseHandler.getNotImplemented,
  index: responseHandler.getIndex,
};

// Input for Parsed Url struct
// default to this on requests
const parseUrlTest = (request, response, acceptedType) => {
  const parsedUrl = url.parse(request.url);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedType);
  } else {
    responseHandler.notFound(request, response, acceptedType);
  }
};


const onRequest = (request, response) => {
  let acceptedType;
  if (request.headers.accept) {
    acceptedType = request.headers.accept;
  } else {
    acceptedType = 'application/json';
  }

  // Don't know if this is the correct way of doing this
  if (request.url.includes('?')) {
    if (request.url.includes('valid=true')) {
      responseHandler.getSuccess(request, response, acceptedType);
    } else if (request.url.includes('loggedIn=yes')) {
      responseHandler.getSuccess(request, response, acceptedType);
    } else {
      parseUrlTest(request, response, acceptedType);
    }
  } else {
    parseUrlTest(request, response, acceptedType);
  }
};


http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
