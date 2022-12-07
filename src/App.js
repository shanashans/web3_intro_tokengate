import React, { Component } from 'react';
import Web3 from 'web3';

class App extends Component {
  
  state = { 
    web3: null,
    accounts: null,
    contract: '0x4c40a6549891549e237f0afe2781a98f9d51e386',
    hasNft: false
  };

  componentDidMount = async () => {
    try {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum); 
        this.setState({ web3 });
      }
    } catch (error) {
      console.error(error);
    }
  };

  connectWallet = async () => {
    const { web3, contract } = this.state;
    try {
      await window.ethereum.enable();
      const accounts = await web3.eth.getAccounts();
      
      const instance = new web3.eth.Contract(
        [{"inputs":[{"internalType": "address","name": "owner","type": "address"}],"name": "balanceOf","outputs": [{"internalType": "uint256","name": "","type": "uint256"}],"stateMutability": "view","type": "function"}],
        contract,
      );

      const nftCount = await instance.methods.balanceOf(accounts[0]).call()
      console.log('balanceOf :: ', nftCount);
      const _hasNft = nftCount > 0 ? true : false;

      this.setState({ web3, accounts, hasNft: _hasNft });
    } catch (error) {
      alert('Failed to load web3 or accounts.');
      console.error(error);
    }
  };

  render() {
    const self = this;
    return (
      <div>
        {!this.state.web3 &&
          <div>
            <h2>No Wallet Detected</h2>
            <p>Please enable a wallet such as Metamask</p>
          </div>
        }
        {!this.state.accounts && this.state.web3 &&
          <div>
            <h3>Token Gate</h3>
            <button onClick={this.connectWallet}>
              Connect Your Wallet
            </button>
            <p>
              <img className="nft" src="media/nft_fade.jpg"/>
            </p>
          </div>
        }
        {this.state.accounts && this.state.hasNft &&
          <div>
            <h3>Token Gate</h3>
            <h4>You have the NFT!</h4>
            <p>
              <img className="nft" src="public/media/nft.jpg"/>
            </p>
          </div>
        }
        {this.state.accounts && !this.state.hasNft &&
          <div>
            <h3>Token Gate</h3>
            <h4>You don't have the NFT...</h4>
            <p>
              <img className="nft" src="media/nft_no.jpg"/>
            </p>
          </div>
        }
      </div>
    );
  }
}

export default App;
