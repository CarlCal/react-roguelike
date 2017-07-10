
import React from "react"

import Board from "../componants/Board"
import Hud from "../componants/Hud"

import * as BoardActions from "../actions/BoardActions"
import BoardStore from "../stores/BoardStore"

export default class Layout extends React.Component {
   
  constructor() {
    super()
    this.getBoard = this.getBoard.bind(this)
    this.resizeBoard = this.resizeBoard.bind(this)
    this.movePlayer = this.movePlayer.bind(this)
		this.state = {
      dungeon: BoardStore.getAll()
    }
  }

  componentWillMount() {
   	BoardStore.on("change", this.getBoard)
    window.addEventListener("resize", this.resizeBoard, false)  
    document.addEventListener("keydown", this.movePlayer, false)
  }

  componentDidMount() {
    console.log("1: Action -> generateMap")
    BoardActions.generateMap()
  }

  componentWillUnmount() {
  	BoardStore.removeListener("change", this.getBoard)
    window.removeEventListener("resize", this.resizeBoard)
    document.removeEventListener("keydown", this.movePlayer)
  }

  getBoard() {
  	this.setState({
  		dungeon: BoardStore.getAll()
  	})
  }

  resizeBoard() {
    BoardActions.resizeBoard()
  }

  movePlayer(event) {
    var { playerLoc, dMap, mapSize } = this.state.dungeon,
        newLocX = playerLoc[0],
        newLocY = playerLoc[1]

    if (event.keyCode === 37 || event.keyCode === 38 || 
        event.keyCode === 39 || event.keyCode === 40) {

      switch(event.keyCode) {
        case 37:
          newLocX--
          break
        case 38:
          newLocY--
          break
        case 39:
          newLocX++
          break
        case 40:
          newLocY++
          break
      }
      if (dMap[newLocY]) {
        this.decideAction(dMap, [newLocX, newLocY])
      }
    }
    this.getBoard()
  }

  decideAction(dMap, newLoc) {
    switch(dMap[newLoc[1]][newLoc[0]]) {
      case 1:
        BoardActions.movePlayer(newLoc)
      break
      case 3:
      case 7:
        BoardActions.fightEnemy(newLoc)
      break
      case 4:
        BoardActions.healPlayer(newLoc)
      break
      case 5:
        BoardActions.newDungeon()
      break
      case 6:
        BoardActions.newWeapon(newLoc)
      break

    }
  }

  render() {
    return (
      <div id="game">
        <Hud dungeon={this.state.dungeon} />
        <Board dungeon={this.state.dungeon} />
      </div>
		)
  }  
}
