const React = require('react');
const ErrorTemplate = require('./ErrorTemplate');

const Web3Unavailable = ErrorTemplate.bind(null, {
  title: 'Aionweb3 Not Found',
  message: `
It seems that you are using a browser without Web3 capabilities.
Please install Aiwa and make sure it's enabled.
<a href='https://getaiwa.com/#download' target='_blank'>Click here to download Aiwa</a>
`
});

module.exports = Web3Unavailable;
