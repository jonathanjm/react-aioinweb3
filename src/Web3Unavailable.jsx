const React = require('react');
const ErrorTemplate = require('./ErrorTemplate');

const Web3Unavailable = ErrorTemplate.bind(null, {
  title: 'Aion wallet Not Found',
  message: `
It seems that you don&apos;t have Aiwa installed.
Please install Aiwa and make sure it's enabled.
<a href='https://getaiwa.com/#download' target='_blank'>Click here to download Aiwa</a>
`
});

module.exports = Web3Unavailable;
