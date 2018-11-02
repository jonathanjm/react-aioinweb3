const React = require('react');
const ErrorTemplate = require('./ErrorTemplate');

const Web3Unavailable = ErrorTemplate.bind(null, {
  title: 'Aionweb3 Not Found',
  message: `
It seems that you are using a browser without Web3 capabilities.
If you are using Aiwa, make sure that it is
enabled.
`
});

module.exports = Web3Unavailable;
