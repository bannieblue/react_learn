import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


//生成对比数组（行 列 两条对角线）
function generateLines(n){
  //basic row array
  let basicArray=[];
  let lines=[];
  for(let i=0;i<n;i++){
    basicArray.push(i);
  }
  //row col lines
  for(let i=0;i<n;i++){
    let row = basicArray.map((x)=>{return x+n*i});
    let col = basicArray.map((x)=>{return x*n+i});
    lines.push(row);
    lines.push(col);
  }
  //cross
  lines.push(basicArray.map((x)=>{return x*n+x}));
  //(n-x)*n-1-(n-x-1)
  lines.push(basicArray.map((x)=>{return (n-x)*n-n+x}));
  return lines;
}

//计算赢家
function calculateWinner(squares,rows){
  // const lines = [
  //     [0, 1, 2],
  //     [3, 4, 5],
  //     [6, 7, 8],
  //     [0, 3, 6],
  //     [1, 4, 7],
  //     [2, 5, 8],
  //     [0, 4, 8],
  //     [2, 4, 6],
  // ];
  const lines =generateLines(rows);
  for(let i =0 ;i<lines.length;i++){
    const row = lines[i];
    const a = squares[row[0]];
    let flag = true;
    for(let i=1;i<row.length;i++){
     if(a !== squares[row[i]]){
       flag = false;
     }
    }
    if(flag){
      return a;
    }
  }
  return null;
}

//方块组件 返回一个方块
function Square(props){
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

//白板组件 返回一个九宫格
class Board extends React.Component {
  //返回一行方块
  renderSquare(rows,index) {
    let list = rows.map((x)=>{
      return (
      <Square key={x}
        value={this.props.squares[x]} 
        onClick={()=>this.props.onClick(x)}
      />
    )});
    return (
      <div key={index} className="board-row">
        {list}
      </div>
    )
  }


  render() {
    let rows = this.props.rowsNumber;
    let basicArray=[];
    let lines=[];
    for(let i=0;i<rows;i++){
      basicArray.push(i);
    }
    //row lines
    for(let i=0;i<rows;i++){
      let row = basicArray.map((x)=>{return x+rows*i});
      lines.push(row);
    }

    let renderBoard = lines.map((arr,index)=>{
      return this.renderSquare(arr,index);
    });

    return (
      <div>
        {renderBoard}
      </div>
    );
  }
}

//游戏组件
class Game extends React.Component {
  constructor(){
    super();
      this.state={
        history:[{
          squares:Array(9).fill(null)
        }],
        rowsNumber:3,
        stepNumber:0,
        xIsNext:true
      }
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    const rowsNumber =this.state.rowsNumber;
    
    if(calculateWinner(squares,rowsNumber) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
        history:history.concat([{
          squares:squares
        }]),
        stepNumber:history.length,
        xIsNext:!this.state.xIsNext
    });
  }

  jumpTo(step){
    this.setState({
      stepNumber:step,
      xIsNext:(step%2) === 0
    });
  }

  handleChange(event){
    console.log(event.target.value);
    let rows = event.target.value;
    this.setState({
        history:[{
          squares:Array(rows*rows).fill(null)
        }],
        rowsNumber:event.target.value,
        stepNumber:0,
        xIsNext:true
      })
  }

  render() {
    const rowsNumber = this.state.rowsNumber;
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares,rowsNumber);
    let status;
    if(winner){
      status = "Winner is "+winner
    }else{
      status = 'Next player: '+ (this.state.xIsNext ? "X":"O");
    }

    const moves = history.map((step,move)=>{
      const desc = move?"Move#"+move:"Game Start";
      return (
        <li key={move}>
          <a onClick={()=>this.jumpTo(move)}>{desc}</a>
        </li>
      )
    });

    return (
      <div className="game">
        <div>
          <span>请选择规格</span>
          <select onChange={(event)=>this.handleChange(event)}>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
          </select>
        </div>
        <div className="game-board">
          <Board squares={current.squares} onClick={(i)=>this.handleClick(i)} rowsNumber= {rowsNumber} />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
