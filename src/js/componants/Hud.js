import React from "react"

import * as BoardActions from "../actions/BoardActions"

export default class Hud extends React.Component {

	constructor(props) {
		super(props)
	}

	componentDidMount() {
		var checkbox = document.querySelector("input[type=checkbox]");

  	checkbox.addEventListener("click", () => {
			BoardActions.toggleLight()
		})
	}

	componentWillUnmount() {
		var checkbox = document.querySelector("input[type=checkbox]");
		checkbox.removeEventListener("click", () => {
			BoardActions.toggleLight()
		})
	}

	render() {
		var dungeon = this.props.dungeon
		return (
			<div id="stats">
				<h1>Game of Life</h1>
				<div>
					<p><strong>Health:</strong> {dungeon.player.hp}</p>
					<p><strong>Attack:</strong> {dungeon.player.pAttack}</p>
					<p><strong>Level:</strong> {dungeon.player.lvl}</p>
					<p><strong>Next level:</strong> {dungeon.player.nextLevel}</p>
					<p><strong>Wepond:</strong> {dungeon.player.wepond.name}</p>
					<p><strong>Dungeon:</strong> {dungeon.dungeonNr}</p>
				</div>
				<div className="checkbox">
					<input type="checkbox" id="checkboxInput" name="lightSwitch" />
					<label htmlFor="checkboxInput" />
				</div>
				<p className="message"><em>{dungeon.message}</em></p>
			</div>
		)
	}
}