const React = require('react');
const PropTypes = require('prop-types');
const isEmpty = require('lodash/isEmpty');
const AccountUnavailable = require('./AccountUnavailable');
const Web3Unavailable = require('./Web3Unavailable');

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;
const propTypes = {
  web3UnavailableScreen: PropTypes.any,
  accountUnavailableScreen: PropTypes.any,
  onChangeAccount: PropTypes.func
};
const defaultProps = {
  passive: false,
  web3UnavailableScreen: Web3Unavailable,
  accountUnavailableScreen: AccountUnavailable
};
const childContextTypes = {
  aionweb3: PropTypes.shape({
    accounts: PropTypes.array,
    selectedAccount: PropTypes.string,
    network: PropTypes.string,
    networkId: PropTypes.string
  })
};

class Web3Provider extends React.Component {

  static contextTypes = {
    store: PropTypes.object
  };

  constructor(props, context) {
    super(props, context);
    const accounts = this.getAccounts();

    this.state = {
      accounts,
      networkId: null,
      networkError: null
    };
    this.interval = null;
    this.networkInterval = null;
    this.fetchAccounts = this.fetchAccounts.bind(this);
    this.fetchNetwork = this.fetchNetwork.bind(this);

    if (accounts) {
      this.handleAccounts(accounts, true);
    }
  }

  getChildContext() {
    return {
      aionweb3: {
        accounts: this.state.accounts,
        selectedAccount: this.state.accounts && this.state.accounts[0],
        network: getNetwork(this.state.networkId),
        networkId: this.state.networkId
      }
    };
  }

  /**
   * Start polling accounts, & network. We poll indefinitely so that we can
   * react to the user changing accounts or netowrks.
   */
  componentDidMount() {
    this.fetchAccounts();
    this.fetchNetwork();
    this.initPoll();
    this.initNetworkPoll();
  }

  /**
   * Init web3/account polling, and prevent duplicate interval.
   * @return {void}
   */
  initPoll() {
    if (!this.interval) {
      this.interval = setInterval(this.fetchAccounts, ONE_SECOND);
    }
  }

  /**
   * Init network polling, and prevent duplicate intervals.
   * @return {void}
   */
  initNetworkPoll() {
    if (!this.networkInterval) {
      this.networkInterval = setInterval(this.fetchNetwork, ONE_MINUTE);
    }
  }

  /**
   * Update state regarding the availability of web3 and an ETH account.
   * @return {void}
   */
  fetchAccounts() {
    const { aionweb3 } = window;
    const ethAccounts = this.getAccounts();

    if (isEmpty(ethAccounts)) {
        aionweb3 && aionweb3.eth && aionweb3.getAccounts.then((accounts) => {

              _this2.handleAccounts(accounts);

        }).catch((e) =>{
            _this2.setState({
              accountsError: err
            });
        });
    } else {
      this.handleAccounts(ethAccounts);
    }
  }

  handleAccounts(accounts, isConstructor = false) {
    const { onChangeAccount } = this.props;
    const { store } = this.context;
    let next = accounts[0];
    let curr = this.state.accounts[0];
    next = next && next.toLowerCase();
    curr = curr && curr.toLowerCase();
    const didChange = curr && next && (curr !== next);

    if (isEmpty(this.state.accounts) && !isEmpty(accounts)) {
      this.setState({
        accountsError: null,
        accounts: accounts
      });
    }

    if (didChange && !isConstructor) {
      this.setState({
        accountsError: null,
        accounts
      });
    }

    // If provided, execute callback
    if (didChange && typeof onChangeAccount === 'function') {
      onChangeAccount(next);
    }

    // If available, dispatch redux action
    if (store && typeof store.dispatch === 'function') {
      const didDefine = !curr && next;

      if (didDefine || (isConstructor && next)) {
        store.dispatch({
          type: 'aionweb3/RECEIVE_ACCOUNT',
          address: next
        });
      } else if (didChange) {
        store.dispatch({
          type: 'aionweb3/CHANGE_ACCOUNT',
          address: next
        })
      }
    }
  }

  /**
   * Get the network and update state accordingly.
   * @return {void}
   */
  fetchNetwork() {
    const { aionweb3 } = window;

    aionweb3 && aionweb3.version && aionweb3.version.getNetwork((err, netId) => {
      if (err) {
        this.setState({
          networkError: err
        });
      } else {
        if (netId != this.state.networkId) {
          this.setState({
            networkError: null,
            networkId: netId
          })
        }
      }
    });
  }

  /**
   * Get the account. We wrap in try/catch because reading `web3.eth.accounrs`
   * will throw if no account is selected.
   * @return {String}
   */
  getAccounts() {
    try {
      const { aionweb3 } = window;
      // throws if no account selected
      const accounts = aionweb3.eth.accounts;

      return accounts;
    } catch (e) {
      return [];
    }
  }

  render() {
    const { aionweb3 } = window;
    const {
      passive,
      web3UnavailableScreen: Web3UnavailableComponent,
      accountUnavailableScreen: AccountUnavailableComponent
    } = this.props;

    if (passive) {
      return this.props.children;
    }

    if (!aionweb3) {
      return <Web3UnavailableComponent />;
    }

    if (isEmpty(this.state.accounts)) {
      return <AccountUnavailableComponent />;
    }

    return this.props.children;
  }
}

Web3Provider.propTypes = propTypes;
Web3Provider.defaultProps = defaultProps;
Web3Provider.childContextTypes = childContextTypes;

module.exports = Web3Provider;

/* =============================================================================
=    Deps
============================================================================= */
function getNetwork(networkId) {
  switch (networkId) {
    case '256':
      return 'MAINNET';
    case '32':
      return 'MASTERY';
    default:
      return 'UNKNOWN';
  }
}
