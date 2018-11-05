const React = require('react');
const ErrorTemplate = require('./ErrorTemplate');

const AccountUnavailable = ErrorTemplate.bind(null, {
  title: 'No AION Account Available',
  message: `
It seems that you don&apos;t have an AION account selected. If using
AIWA, please make sure that your wallet is unlocked and that
you have at least one account in your accounts list.`
});

module.exports = AccountUnavailable;
