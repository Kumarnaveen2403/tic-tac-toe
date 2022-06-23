import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function getGameStatus2(squares){
    let winCombs = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i = 0; i < winCombs.length; i++){
        let winComb = winCombs[i];
        let s1 = winComb[0];
        let s2 = winComb[1];
        let s3 = winComb[2];

        if(squares[s1] != null && squares[s1] == squares[s2] && squares[s2] == squares[s3]){
            return squares[s1];
        }
    }

    return null;
}


function getGameStatus(squares){
    let winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        [0, 4, 8],
        [2, 4, 6]
    ];

    for(let i = 0; i < winCombos.length; i++){
        let winCombo = winCombos[i];

        let c1 = winCombo[0];
        let c2 = winCombo[1];
        let c3 = winCombo[2];

        if(squares[c1] != null && squares[c1] == squares[c2] && squares[c2] == squares[c3]){
            return squares[c1];
        }
    }
    
    return null;
}

class Board extends React.Component {
    handleBoxClick(i){
        this.props.handlerForBoxClick(i);
    }

    renderSquare(i){
        return (
            <button onClick={() => this.handleBoxClick(i)}>{this.props.boxes[i] == null? "" : this.props.boxes[i] }</button>
        );
    }

    render(){
        return (
            <div className="board">
                <div className="title">
                    Tic Tac Toe
                </div>
                <div className="content">
                    <div className="ttt">
                        <div className="row">
                            {this.renderSquare(0)}
                            {this.renderSquare(1)}
                            {this.renderSquare(2)}
                        </div>
                        <div className="row">
                            {this.renderSquare(3)}
                            {this.renderSquare(4)}
                            {this.renderSquare(5)}
                        </div>
                        <div className="row">
                            {this.renderSquare(6)}
                            {this.renderSquare(7)}
                            {this.renderSquare(8)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Display extends React.Component {
    moveHistory(i){
        this.props.handlerForHistory(i);
    }

    render(){
        let gameTitle = null;

        if(this.props.gameStatus != null){
            gameTitle = this.props.gameStatus + " Wins";
        } else {
            if(this.props.stepNumber % 2 == 0){
                gameTitle = "Next move for X";
            } else {
                gameTitle = "Next move for O";
            }
        }
        
        let buttons = [];
        for(let i = 0; i <= this.props.stepNumber; i++){
            let button = null;

            if(i == 0){
                button = (<button key={i} onClick={() => this.moveHistory(i)}>Go to Start</button>);
            } else {
                button = (<button key={i} onClick={() => this.moveHistory(i)}>Go to step number {i}</button>);
            }

            buttons.push(button);
        }

        return (
            <div className="display">
                <div className="title">
                    {gameTitle}
                </div>
                <div className="content">
                    <div className="history">
                        {buttons}
                    </div>
                </div>
            </div>
        );
    }
}

class TTT extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            history : [
                [null, null, null, null, null, null, null, null, null]
            ],
            stepNumber : 0,
            gameStatus : null
        }
    }

    handleSquareClick(i){
        let oldHistory = this.state.history.slice();
        let lastStateOfSquares = oldHistory[oldHistory.length - 1].slice();

        if(lastStateOfSquares[i] != null || getGameStatus(lastStateOfSquares) != null){
            return;
        }

        lastStateOfSquares[i] = this.state.stepNumber % 2 == 0 ? "X" : "O";
        oldHistory.push(lastStateOfSquares);

        let newGameStatus = getGameStatus(lastStateOfSquares);

        if(this.state.stepNumber == 8 && getGameStatus(lastStateOfSquares) == null){
            newGameStatus = "Draw!!!";
        }

        this.setState({
            history : oldHistory,
            stepNumber : this.state.stepNumber + 1,
            gameStatus : newGameStatus
        });
    }

    moveToStep(i){
        let oldHistory = this.state.history.slice(0, i + 1);
        let currentSuqares = oldHistory[oldHistory.length - 1];
        let newGameStatus = getGameStatus(currentSuqares);

        this.setState({
            history : oldHistory,
            stepNumber : i,
            gameStatus : newGameStatus
        });
    }

    render(){
        let squares = this.state.history[this.state.history.length - 1];

        return (
            <>
                <Board handlerForBoxClick={(i) => this.handleSquareClick(i)} boxes={squares}/>
                <Display 
                    stepNumber={this.state.stepNumber} 
                    gameStatus={this.state.gameStatus} 
                    handlerForHistory={(i) => this.moveToStep(i)}
                />
            </>
        );
    }
}

ReactDOM.render(<TTT />, document.querySelector("#root"));