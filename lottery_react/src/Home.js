import React, { Component, useState, useEffect  } from 'react'
import Web3 from "./web3";
import lottery from "./lottery";
import web3 from './web3';

export default class Home extends Component {
    state = {
        manager: '',
        players: [],
        balance: '',
        value: '',
        message: '',
    }
    async componentDidMount() {
        const manager = await lottery.methods.manager().call();
        const players = await lottery.methods.getPlayers().call();
        const balance = await web3.eth.getBalance(lottery.options.address);
        this.setState({manager, players, balance});
    }

    onSubmit = async (event) => {
        event.preventDefault();
        let message = 'Waiting for the transaction to be completed';
        this.setState({message});
        const accounts = await web3.eth.getAccounts();
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.value, 'ether')
        });
        message='Transaction Completed';
        this.setState({message});
    }

    pickWinner = async (event) => {
        let message = 'Waiting for the transaction to be completed';
        this.setState({message});
        const accounts = await web3.eth.getAccounts();
        await lottery.methods.pickWinner().send({from: accounts[0]});
        message='A Winner Has Been Picked!';
        this.setState({message});
    }

    
    render() {
        
        return (
            <div>
                <h2>Lottery Contract</h2>
                <p>This Contract is managed by: {this.state.manager}</p>

                <h2>Total Players</h2>
                <p>We have total {this.state.players.length} Players competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether</p>
                <br/>
                <br/>
                <hr/>
                <form onSubmit = {this.onSubmit}>
                    <h4>Want to try your luck?</h4><br/>
                    <div>
                        <label>Amount of ether to enter</label> <br/>
                        <input value={this.state.value} onChange = {event => this.setState({value: event.target.value})} /><br />
                        <button>Submit</button>
                    </div>
                </form>
                <hr/>
                <h4>Time to pick a winner?</h4>
                <button onClick = {this.pickWinner}>Pick Winner</button>
                <hr/>
                <h4>Status: </h4><br/>
                <p>{this.state.message}</p>
            </div>
        )
    }
}
