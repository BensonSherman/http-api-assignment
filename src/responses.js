const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const style = fs.readFileSync(`${__dirname}/../client/style.css`);

// Response Method
const respond = (request, response, content, type, code) => {
  response.writeHead(code, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// Makes content to print out on the screen when doing a
// request that does not involve reloading the page
const getContent = (request, response, contentType, message, code) => {
  if (contentType === 'text/xml') {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${message} XML</message>`;
    responseXML = `${responseXML} <id>${code}</id>`;
    responseXML = `${responseXML} </response>`;

    return respond(request, response, responseXML, 'text/xml', code);
  }

  const jsonObj = {
    message: `${message} JSON`,
    code: `${code}`,
  };

  const returnString = JSON.stringify(jsonObj);
  return respond(request, response, returnString, 'application/json', code);
};

// Get methods based on what url was passed in
// All end up at the respond method,
// some go through the get content method first
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html', 200);
};

const getCss = (request, response) => {
  respond(request, response, style, 'text/css', 200);
};

const getSuccess = (request, response, contentType) => {
  getContent(request, response, contentType, 'Sucessful request returned in', 200);
};
const getBadRequest = (request, response, contentType) => {
  getContent(request, response, contentType, 'Bad Request made in', 400);
};
const getUnauthorized = (request, response, contentType) => {
  getContent(request, response, contentType, 'Unauthorized user requesting something in', 401);
};
const getForbidden = (request, response, contentType) => {
  getContent(request, response, contentType, 'YOU ARE FORBIDDEN from making that request in', 403);
};
const getInternalError = (request, response, contentType) => {
  getContent(request, response, contentType, 'There was an internal error when you made that request in', 500);
};
const getNotImplemented = (request, response, contentType) => {
  getContent(request, response, contentType, 'What you were looking for was not yet implemented when you made that request in', 501);
};
const notFound = (request, response, contentType) => {
  getContent(request, response, contentType, 'What you were looking for was not found when you made that request in', 404);
};


module.exports = {
  getCss,
  getIndex,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternalError,
  getNotImplemented,
  notFound,
};
