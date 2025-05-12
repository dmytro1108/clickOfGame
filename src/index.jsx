"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const client_1 = require("react-dom/client");
class GetTheCoords {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
}
class MyListState {
    constructor() {
        this.nClicks = 0;
    }
}
/**
 * The Board class encompasses a framework for the game playing field. The buildGrid method is
 * responsible for producing an array of cell objects, where each cell stores the coordinate, color,
 * and i number which is used for point evaluation. The render component of the class will overlay the
 * interactive cell grid over the game board within a parent div, and will re render state with subsequent clicks.
 * The onClick method is responsible for tracking what cell a player taps in, the method takes coordinates as
 * parameters to help determine what happens on the board.
 */
class Board extends react_1.Component {
    constructor(props) {
        super(props);
        // empty object cell array
        this.cellObj = [];
        // clicks are added here, get's the coordinates
        this.addClick = (row, col) => {
            let coords = new GetTheCoords();
            coords.x = col;
            coords.y = row;
            console.log(`(x (row): ${coords.x}, y (col):${coords.y})`);
            this.game.changeColor(coords.x, coords.y);
            this.game.neighbors(coords.x, coords.y);
            this.setState({}); // render the component
        };
        this.state = new GetTheCoords();
        this.game = new GameModel(this.cellObj);
        this.addClick = this.addClick.bind(this);
    }
    // method that returns an array of object cells
    buildGrid() {
        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                // access cell
                let cell = {
                    coordinates: [i, j],
                    color: "None",
                    i: 0
                };
                this.cellObj.push(cell);
            }
        }
        this.game.hiddenToken();
        return this.cellObj;
    }
    // this will overlay the interactive cell grid over the game board
    render() {
        let grid = this.buildGrid();
        this.cellObj.length = 256;
        // print the score
        let score = this.game.returnCount();
        console.log("the score is: ", score);
        // render canvas
        const cnvs = <canvas id="theGameBoard" width={this.props.height} height={this.props.height} style={{ border: "10px solid rgb(201, 139, 210)",
                background: "rgb(44, 196, 153)" }}>
            </canvas>;
        // render the the array for JSX
        const renderedArray = <div style={{
                display: "flex",
                flexWrap: "wrap",
            }}>
            {grid.map((cell, lc) => (
            // list the cells
            // return a function for onClick
            // give each cell a border (square)
            <div key={lc} onClick={() => this.addClick(cell.coordinates[1], cell.coordinates[0])} style={{ border: "1px solid black", cursor: "pointer", width: 60, height: 60, color: cell.color, background: cell.color }}>


                </div>))}
        </div>;
        // contains the object cells as a flexible grid
        // style parent div for the overlay and grid
        return <div style={{
                position: "relative",
                width: this.props.width,
                height: this.props.height,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>

                    {cnvs}
           
                <div id="overlay" style={{
                position: "absolute",
                display: "hidden",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
            }}>
                        <div id="grid"> {renderedArray}

                            <ul style={{ fontSize: "50px" }}> your score {score}</ul>

                        </div>
                         
                        
                </div>

        </div>;
    }
}
/**
 * The GameModel class is responsible for handling all of the game logic. The method changeColor is
 * responsible for changing the color of each cell once tapped. Hidden token will generate a
 * random cell that has a point value. Return count will return the player score. The neighbors
 * method follows uses a Moore neighborhood cellular automata strategy to find the neighbor of
 * each cell a player taps on.
 */
class GameModel {
    constructor(cells) {
        this.cellObjects = cells;
        this.count = 0;
    }
    changeColor(row, col) {
        // given the row and column do something to the cell, like give it a color
        const index = row * 16 + col;
        const currColor = this.cellObjects[index].color;
        const curr = this.cellObjects[index];
        if (currColor === "None") {
            curr.color = "white";
        }
        else if (currColor === "white") {
            curr.color = "black";
        }
        else {
            curr.color = "white";
        }
        console.log("changed color");
        // if the color is black, change it back
    }
    // initialize with a single token hidden in the 64 cell grid
    hiddenToken() {
        // random index from 1-64
        const rnd = Math.floor(Math.random() * (Math.floor(256) - Math.ceil(1) + 1) + Math.ceil(1));
        const rnd2 = Math.floor(Math.random() * (Math.floor(256) - Math.ceil(1) + 1) + Math.ceil(1));
        // set the cell color of the random index
        this.cellObjects[rnd].i = 1;
        this.cellObjects[rnd2].i = 2;
    }
    returnCount() {
        return this.count;
    }
    // capture the valued cells
    neighbors(row, col) {
        let neighbors = [
            [0, 1],
            [1, 0],
            [0, -1],
            [-1, 0],
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];
        let index = row * 16 + col;
        let cell = this.cellObjects[index];
        let currentColor = cell.color;
        // find neigbors
        for (let i = 0; i < neighbors.length; i++) {
            let nRow = row + neighbors[i][0];
            let nCol = col + neighbors[i][1];
            if (nRow >= 0 && nRow < 16 && nCol >= 0 && nCol < 16) {
                let index = nRow * 16 + nCol;
                let nCell = this.cellObjects[index];
                // capture the red
                if (nCell.i == 1) {
                    nCell.color = "red";
                    nCell.i = 0;
                    this.count += 1 * 10;
                }
                // capture the yellow
                if (nCell.i == 2) {
                    nCell.color = "yellow";
                    nCell.i = 0;
                    this.count += 1 * 100;
                }
            }
        }
    }
}
/**
 * This class is a framework for the game description.
 */
class Description extends react_1.Component {
    render() {
        // text reading the name of the game
        // the rules
        // and lets the player see their score
        return <div>
            <p>
            </p>
                <ul style={{ fontSize: "50px" }}>Click of game</ul>
                <li style={{ fontSize: "30px" }}>Rule: click anywhere in the grid to get points. Thats all.
                </li>
                <li style={{ fontSize: "30px" }}>The points are allocated as follows: Red cell: 10pts, Yellow cell: 100pts</li>
        </div>;
    }
}
const rootElem = document.getElementById('root');
if (rootElem == null) {
    alert('you forgot to put a root element in your HTML file.');
}
const root = (0, client_1.createRoot)(rootElem);
//<Board height={10} width={10}/>
root.render(<react_1.StrictMode>
        <div>
            <Description />
            <Board height={1000} width={1000}/>
        </div>
       
    </react_1.StrictMode>);
