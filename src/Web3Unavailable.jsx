const React = require('react');
const ErrorTemplate = require('./ErrorTemplate');

const Web3Unavailable = ErrorTemplate.bind(null, {
  title: 'Connecting to AIWA...',
  message: `
If you have AIWA installed and activated, this page will be reloaded in a few
minutes. If you don’t, <a href='https://getaiwa.com/#download' target='_blank'>click here to install AIWA</a>
`
});

module.exports = Web3Unavailable;
