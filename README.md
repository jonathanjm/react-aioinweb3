# React Web3


This is a fork of https://github.com/coopermaruyama/react-web3 to make it work with Aiwa(Aion's browser plugin/wallet)

Ensure web3 is available before your app loads.

`react-web3` exports a `<Web3Provider />` React component which wraps your app
and ensures it doesn't render until web3 is available. It also renders a nice
message to the user to guide them in the following cases:

1. The user is not using a web3-capable browser, or
2. The user has web3 support, but their account is locked (their ETH address is inaccessible)

Along with the above, `<Web3Provider />` also:

 * Reacts to the user unlocking their wallet or switching accounts.
 * Provides a context to your entire app with useful data.
 * Accepts a callback that is called when user switches to a different account.


## Installation

```
$ npm install react-aionweb3

```

## Test

```
$ npm test
```

## Usage

Wrap your root-level react component:

```js
import { Web3Provider } from 'react-aionweb3';

// ...

// Ensure that <App /> doesn't render until we confirm web3 is available
ReactDOM.render(rootEl,
  <Web3Provider>
    <App />
  </Web3Provider>
);
```

### Context

`<Web3Provider />` provides a child context to your app with useful data:

```js
import React from 'react';
import PropTypes from 'prop-types';

function SomeComponent(props, context) {
  const web3Context = context.aionweb3;

  /**
   * web3Context = {
   *   accounts: {Array<string>} - All accounts
   *   selectedAccount: {string} - Default ETH account address (coinbase)
   *   network: {string} - One of 'MAINNET', 'MASTERY', or 'UNKNOWN'
   *   networkId: {string} - The network ID (e.g. '1' for main net)
   * }
   */

  return (
    <div>
      Hello Web3
    </div>
  );
}

SomComponent.contextTypes = {
  web3: PropTypes.object
};

export default SomeComponent;
```

### Accepted Props

`<Web3Provider />` accepts the following optional props:

  * **`onChangeAccount`** *(Function)*:  Callback which is called when the user switches to
  a new account. Callback will receive the new ETH address as an argument.
    * **Example:** `onChangeAccount={nextAddress => console.log(nextAddress)}`
  * **`web3UnavailableScreen`** *(ReactElement)*: React component to override the screen that is
  shown when web3 is unavailable.
    * **Example:** `web3UnavailableScreen={() => <div>You need web3!</div>}`
  * **`accountUnavailableScreen`** *(ReactElement)*: React component to override the screen that
  is shown when the user's wallet is locked.
    * **Example:** `accountUnavailableScreen={() => <div>Please unlock your wallet!</div>}`
  * **`passive`** *(Boolean)*: If true, your app will be rendered right away
  even if an ETH address is not available, and the message screens will become
  irrelevant and never be rendered. This is useful for apps that don't
  require web3 in order to render the app, but which has optional features that
  require web3. An example would be if you had an online store that simply
  allowed ETH as a payment option. In this case, you could read the web3 context
  and handle it manually in any of your components.
    * **Example:**
      ```js
      const methods = ['Credit Card', 'Check', 'Ether'];
      const PaymentMethods = (props, context) => (
        <div>
          {methods.filter(
            // filter out the 'Ether' option if no account is available
            method => method !== 'Ether' || !!context.aionweb3.selectedAccount
          ).map(
            method => <PaymentMethod method={method} key={method} />
          )}
        </div>
      )
      ```

### Redux Support

If you're using `react-redux`, then you most likely have a `<Provider />`
component at the very root of your app. If this is the case, `<Web3Provider />`
will dispatch the following actions to you redux store:

* **`web3/RECEIVE_ACCOUNT`:** Dispatched the first time an ETH account is
available.
* **`web3/CHANGE_ACCOUNT`:** Dispatched when the user switches between accounts.

Both actions provide the ETH address at `action.address`;

#### Example Usage:

```js
// In your reducer:
function reducer(state, action) {
  switch(action.type) {
    case 'web3/RECEIVE_ACCOUNT':
      return {
        ...state,
        ethAddress: action.address
      };

    case 'web3/CHANGE_ACCOUNT':
      return {
        ...state,
        ethAddress: action.address
      };
  }
}
```
