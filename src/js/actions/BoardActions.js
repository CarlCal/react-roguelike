
import dispatcher from "../dispatcher"

export function generateMap() {
	console.log("2: Dispatch GENERATE_MAP")
  dispatcher.dispatch({
  	type: "GENERATE_MAP"
  })
}

export function toggleLight() {
  dispatcher.dispatch({
    type: "TOGGLE_LIGHT"
  })
}

export function resizeBoard() {
  dispatcher.dispatch({
  	type: "RESIZE_BOARD"
  })
}

export function movePlayer(newLoc) {
  dispatcher.dispatch({
  	type: "MOVE_PLAYER",
  	newLoc: newLoc
  })
}

export function fightEnemy(newLoc) {
  dispatcher.dispatch({
  	type: "FIGHT_ENEMY",
  	newLoc: newLoc
  })
}

export function healPlayer(newLoc) {
  dispatcher.dispatch({
  	type: "HEAL_PLAYER",
  	newLoc: newLoc
  })
}

export function newDungeon(newLoc) {
  dispatcher.dispatch({
  	type: "NEW_DUNGEON"
  })
}

export function newWeapon(newLoc) {
  dispatcher.dispatch({
  	type: "NEW_WEAPON",
  	newLoc: newLoc
  })
}

