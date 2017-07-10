
import React from "react"

export default class Board extends React.Component {

	constructor(props) {
		super(props)
	}

  drawMap() {
    const { startRow, stopRow, startCol, stopCol } = this.props.dungeon.mapBoundary

    return (
      this.props.dungeon.dMap.map((v,i) => {
        if ( i < startRow || i > stopRow ) {
          return
        }
        return (
          <div className="row" data-row={i} key={i}>
            {this.drawTiles(i, startCol, stopCol)}
          </div>
        )
      })
    )
  }

  drawTiles(row, startCol, stopCol) {
    const { playerLoc, lights } = this.props.dungeon
    
    return (
      this.props.dungeon.dMap[row].map((v,col) => {
        
        if ( col < startCol || col > stopCol ) {
          return
        }

        var tileClass = 'tile '
        if (v === 1) {tileClass += 'floor '}
        else if (v === 2) {tileClass += 'player '}
        else if (v === 3) {tileClass += 'enemy '}
        else if (v === 4) {tileClass += 'health '}
        else if (v === 5) {tileClass += 'exit '}
        else if (v === 6) {tileClass += 'weapon '}
        else if (v === 7) {tileClass += 'boss '}

        switch(row) {
          case playerLoc[1] - 5:
          case playerLoc[1] + 5:
            if ( col >= playerLoc[0] - 3 && col <= playerLoc[0] + 3 ) {
            } else if ( !lights ) {
              tileClass = 'tile fog'
            }
          break
          case playerLoc[1] - 4:
          case playerLoc[1] + 4:
            if ( col >= playerLoc[0] - 4 && col <= playerLoc[0] + 4 ) {
            } else if ( !lights ) {
              tileClass = 'tile fog'
            }
          break
          case playerLoc[1] - 3:
          case playerLoc[1] + 3:
            if ( col >= playerLoc[0] - 5 && col <= playerLoc[0] + 5 ) {
            } else if ( !lights ) {
              tileClass = 'tile fog'
            }
          break
          case playerLoc[1] - 2:
          case playerLoc[1] - 1:
          case playerLoc[1]:
          case playerLoc[1] + 1:
          case playerLoc[1] + 2:
            if ( col >= playerLoc[0] - 5 && col <= playerLoc[0] + 5 ) {
            } else if ( !lights ) {
              tileClass = 'tile fog'
            }
          break
          default:
            if ( !lights ) {
              tileClass = 'tile fog'
            }
          break
        }
        
        return (
          <div id={row + "-" + col} className={tileClass} data-tile={col} key={col}></div>
        )
      })
    )
  }

	render() {
		return (
      <div id="board" className="board">
        {this.drawMap()}          
      </div>
		)
	}
}

