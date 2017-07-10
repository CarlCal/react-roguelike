 
import { EventEmitter } from "events"

import dispatcher from "../dispatcher"

class BoardStore extends EventEmitter {
	constructor() {
    super()
    this.dungeon = {
    	mapSize: 64,
    	dMap: [],
	    mapBoundary: {
        startRow: 0,
        stopRow: 0,
        startCol: 0,
        stopCol: 0
      },
      message: "Let the games begin!",
	    lights: false,
	    playerCount: 1,
    	playerLoc: [],
	    player: {
	    	hp: 250,
	    	nextLevel: 100,
	    	lvl: 1,
	    	wepond: {
	    		name: "Fists",
	    		attack: 1
	    	},
	    	pAttack: 10
	    },
	    dungeonNr: 1,
	    enemyCount: 10,
	    bossCount: 1,
	    enemies: [],
	    healthCount: 8,
	    exitCount: 1,
	    weaponCount: 1,
	    items: {
		    health: 50,
		    weapons: {
		      1: {
		        name: 'Baseball Bat',
		        attack: 2
		      },
		      2: {
		        name: 'Dagger',
		        attack: 3
		      },
		      3: {
		        name: 'Sword',
		        attack: 4
		      },
		      4: {
		        name: 'Handgun',
		        attack: 99
		      }
		    }
		  }
  	}
  }

  getAll() {
  	return this.dungeon
  }

  generateMap(dMap, mapSize, dungeonNr) {
    /* Initialize the map with empty tiles */
    for (var y = 0; y < mapSize; y++) {
      dMap[y] = []
      for (var x = 0; x <mapSize; x++) {
        dMap[y][x] = 0
      }
    }

    /* Add the first room */
    var mapCenter = Math.round(mapSize/2),
        roomSizeY = Math.floor(Math.random() * 10) + 3,
        roomSizeX = Math.floor(Math.random() * 10) + 3

    for (var i = -Math.round(roomSizeY / 2); i < Math.round(roomSizeY / 2); i++) {
      for (var j = -Math.round(roomSizeX / 2); j < Math.round(roomSizeX / 2); j++) {
        dMap[mapCenter + i][mapCenter + j] = 1
      }
    }

    var rooms = 0;
    while (rooms < 25) {
      var dir = "", i = 0;
      
      /* Find doorway */
      while (i < Math.pow(64, 2)) {
        var y = Math.floor(Math.random() * (mapSize - 2)) + 1, 
            x = Math.floor(Math.random() * (mapSize - 2)) + 1

        if (dMap[y][x] === 0 && 
           (dMap[y-1][x] === 1 || dMap[y+1][x] === 1)) {

          if (dMap[y-1][x] === 1) {dir = '+y'}
          else if  (dMap[y+1][x] === 1) {dir = '-y'}
          break
        } else if (dMap[y][x] === 0 && 
                  (dMap[y][x-1] === 1 || dMap[y][x+1] === 1)) {

          if (dMap[y][x-1] === 1) {dir = '+x'} 
          else if  (dMap[y][x+1] === 1) {dir = '-x'}
          break
        } else {i++}
      }

      var newRoom = this.getRoom(dMap, x, y, dir)
      if (newRoom.length > 0) {
        for (var k = 0; k < newRoom.length; k++) {
          for (var l = 0; l < newRoom[k].length; l++) {
            dMap[newRoom[k][l][1]][newRoom[k][l][0]] = 1
          }
        }
        rooms++
        console.log("- Room Added ", rooms)
      }  else {console.log("- Could not add the room")}
    }

  	dMap = this.populateMap(dMap, dungeonNr)
  	console.log("3: Store -> generateMap")

	  this.dungeon.dMap = dMap
    this.getBoundary()
  }

  getRoom(dMap, x, y, dir) {
    var width = Math.floor(Math.random() * 10) + 3,
        height = Math.floor(Math.random() * 10) + 3,  
        iMin = 0, iMax = 0, jMin = 0, jMax = 0, newRoom = [], entrance = 0

    if (dir[1] === 'y') {
      entrance = Math.floor(Math.random() * (width-1))
      iMin = 0 
      iMax = height
      jMin = -entrance 
      jMax = (width - entrance)
    } else if (dir[1] === 'x') {
      entrance = Math.floor(Math.random() * (height-1))
      iMin = -entrance
      iMax = (height - entrance)
      jMin = 0
      jMax = width
    }
    console.log("Room Direction ", dir)
    for (var i = iMin; i < iMax; ) {
      var row = []
      for (var j = jMin; j < jMax; j++) {
        if (dir === '-y') {
          if (typeof dMap[y-i] !== 'object' ||
                     dMap[y-i][x+j] !== 0) 
            {newRoom = []; return []} 
          else {row.push([x+j, y-i]);}

        } else if (dir === '+y') {
          if (typeof dMap[y+i] !== 'object' ||
                     dMap[y+i][x+j] !== 0) 
            {newRoom = []; return []}
          else {row.push([x+j, y+i]);}

        } else if (dir === '-x') {
          if (typeof dMap[y+i] !== 'object' || 
                     dMap[y+i][x-j] !== 0) 
            {newRoom = []; return []}
          else {row.push([x-j, y+i]);}

        } else if (dir === '+x') {
          if (typeof dMap[y+i] !== 'object' ||
                     dMap[y+i][x+j] !== 0) 
            {newRoom = []; return []}
          else {row.push([x+j, y+i]);}
        } else {return []} 
  
        if (j === jMax-1) {
          newRoom.push(row)
          i++
        }
      }

      if (i === iMax) {return newRoom}
    }
  }

  populateMap(dMap, dungeonNr) {
  	var { playerCount, playerLoc, 
  				enemyCount, enemies,
  				healthCount, weaponCount, 
  				exitCount, bossCount } = this.dungeon,
  			population = [],
  			yLoc = 0,
				xLoc = 0
    
    /* Initialize the empty population array */
    for (var i = 0; i < dMap.length; i++) {
      dMap[i].map((type, count) => {
        if (type === 1) {
          population.push([type, count , i])
        }
      })
    }

    if (dungeonNr > 1) { 
      enemies = [] 
    }

    if (dungeonNr > 3) {
      exitCount = 0
    } else {bossCount = 0}

    var popCounts = [playerCount, enemyCount, healthCount, exitCount, weaponCount, bossCount]

    for (var a = 0; a < popCounts.length; a++) {
    	for (var b = 0; b < popCounts[a]; b++) {
    		yLoc = Math.floor(Math.random() * (population.length))
    		if (population[yLoc][0] === 1 ) {
    			var rowCoord = population[yLoc][2],
    					colCoord = population[yLoc][1]

    			switch(a) {
    				// Player
	    			case 0:
	    				population[yLoc][0] = 2
	    				playerLoc = []
	    				playerLoc.push(colCoord, rowCoord)
	    			break
	    			// Enemy
	    			case 1:
	    				population[yLoc][0] = 3
	    				enemies.push({
	    					loc: [colCoord, rowCoord],
	    					health: 50 * dungeonNr,
	    					xp: 20 * dungeonNr,
	    					lvl: dungeonNr,
	    					attack: 12 * dungeonNr
	    				})
	    			break
	    			// Health
	    			case 2:
	    				population[yLoc][0] = 4
	    			break
	    			// Exit
	    			case 3:
	    				population[yLoc][0] = 5
	    			break
	    			// Weapond
	    			case 4:
	    				population[yLoc][0] = 6
	    			break
            // Boss
            case 5:
              population[yLoc][0] = 7
              enemies.push({
                loc: [colCoord, rowCoord],
                health: 9999,
                lvl: 99,
                attack: 150
              })
            break
	    		}
    		} else {b--}
    	}
    }

    for (var x = 0; x < population.length; x++) {
      var uRow, uCol, uValue = 0;
      population[x].map((v, index) => {
        switch(index) {
          case 0:
            uValue = v
          break
          case 1:
            uCol = v
          break
          case 2:
            uRow = v
          break
        }
      })
      
      dMap[uRow][uCol] = uValue
    }

    this.dungeon.playerLoc = playerLoc
    this.dungeon.dungeonNr = dungeonNr
    this.dungeon.enemies = enemies
    console.log("Map Populated")
  	return dMap
  }

  fightEnemy(newLoc, enemies, player) {
  	var index = enemies.findIndex((e) => {
  							 	return e.loc[0] === newLoc[0] && e.loc[1] === newLoc[1]
  							})

  	var damageArrPlayer = [player.pAttack - 1, player.pAttack, player.pAttack + 1],
  			damageArrEnemy = [enemies[index].attack - 1, enemies[index].attack, enemies[index].attack + 1]  

  	var playerDamage = damageArrPlayer[Math.floor((Math.random() * 3))],
  			enemieDamage = damageArrEnemy[Math.floor((Math.random() * 3))]

  	enemies[index].health -= playerDamage
  	console.log("You delt " + playerDamage + " damage")
  	player.hp -= enemieDamage
  	console.log("It delt " + enemieDamage + " damage")
  	this.dungeon.message = "You delt " + playerDamage + " damage - It delt " + enemieDamage + " damage"

  	if (player.hp <= 0) {
  		console.log("Bro ... you dead")
  		this.dungeon.message = "Bro ... you dead"
      this.restartGame()
      return;
  	} else {
  		if (enemies[index].health <= 0) {
  			console.log("You killed an enemie and earned " + enemies[index].xp + "xp" )
  			this.dungeon.message = "You killed an enemie and earned " + enemies[index].xp + "xp"
  			player.nextLevel -= enemies[index].xp

        if (player.nextLevel <= 0) {
          player = this.levelUp(player)
        }

        if (enemies[index].lvl === 99) {
          console.log("You WON")
          this.dungeon.message = "You WON"
          this.restartGame()
          return;
        }

        enemies.splice(index, 1)

  			this.dungeon.player = player
				this.dungeon.enemies = enemies

				var { playerLoc, dMap } = this.dungeon
				this.movePlayer(newLoc, playerLoc, dMap)

  		} else {
  			console.log(player.hp, enemies[index].health)
				this.dungeon.player = player
				this.dungeon.enemies = enemies
  		}
  	}
  }

  restartGame() {
    var {dMap, mapSize, dungeonNr} = this.dungeon
    dungeonNr = 1

    console.log("restarting...")

    this.generateMap(dMap = [], mapSize, dungeonNr)
    
    this.dungeon.dungeonNr = dungeonNr
    this.dungeon.player = {
        hp: 250,
        nextLevel: 100,
        lvl: 1,
        wepond: {
          name: "Fists",
          attack: 1
        },
        pAttack: 10
      }
  }

  healPlayer(player, items) {
  	player.hp += items.health
  	this.dungeon.player = player
  	this.dungeon.message = "You healed " + items.health + " hp" 
  	console.log("player HP: ", player.hp)
  }

  newWeapon(player, weapond, dungeonNr) {
  	player.wepond = weapond["" + dungeonNr]
		player.pAttack = 8 * player.lvl * weapond["" + dungeonNr].attack 
  	this.dungeon.player = player
  	console.log("You've picked up a", weapond["" + dungeonNr])
  	this.dungeon.message = "You've picked up a " + weapond["" + dungeonNr].name
  }

  levelUp(player) {
  	switch(player.lvl) {
      case 1:
        player.nextLevel = 250
      break
      case 2:
        player.nextLevel = 600
      break
      case 3:
        player.nextLevel = 1000
      break
      case 4:
        player.nextLevel = 1500
      break
      case 5:
        player.nextLevel = 1800
    }

    player.lvl++
		player.hp += 50 * player.lvl
		player.pAttack = 8 * player.lvl * player.wepond.attack
		this.dungeon.message = "You Leveled up!"
  	return player
  }

  movePlayer(newLoc, playerLoc, dMap) {
  	var oldPlayerLoc = document.getElementById(playerLoc[1] + "-" + playerLoc[0]),
				newPlayerLoc = document.getElementById(newLoc[1] + "-" + newLoc[0])

		oldPlayerLoc.className = "tile "
		newPlayerLoc.className = "tile player "

		dMap[playerLoc[1]][playerLoc[0]] = 1
		dMap[newLoc[1]][newLoc[0]] = 2

		this.dungeon.playerLoc = newLoc
		this.getBoundary()	
  }

  getBoundary() {
	  var tileSize = 20, // Must be equall to the tile size in CSS
	  		gameMap = document.getElementById('board'),
	  		width = window.innerWidth,
	  		height = gameMap.clientHeight,
	  		{ playerLoc, mapSize } = this.dungeon

	  var maxRows = Math.floor(height / tileSize),
	  		maxCols = Math.floor(width / tileSize)
	  
	  var startRow = playerLoc[1] - Math.floor( maxRows / 2 )
	  if ( startRow < 0 ) { startRow = 0 }
	  if ( startRow + maxRows > mapSize ) { startRow = mapSize - maxRows }
	  var stopRow = startRow + maxRows
	  
	  var startCol = playerLoc[0] - Math.floor( maxCols / 2 )
	  if ( startCol < 0 ) { startCol = 0 }
	  if ( startCol + maxCols > mapSize ) { startCol = mapSize - maxCols }
	  var stopCol = startCol + maxCols

		this.dungeon.mapBoundary = {
	    startRow: startRow,
	    stopRow: stopRow,
	    startCol: startCol,
	    stopCol: stopCol
		}
	  this.emit("change")
	}

	toggleLight() {
		var { lights } = this.dungeon
		this.dungeon.lights = !lights
		this.emit("change")
	}

  handleActions(action) {
  	var { enemies, player, items, 
  				dMap, mapSize, dungeonNr,
  				playerLoc, lights } = this.dungeon

  	switch(action.type) {
  		case "GENERATE_MAP":
  			this.generateMap(dMap, mapSize, dungeonNr)
  		break
  		case "TOGGLE_LIGHT":
  			this.toggleLight(lights)
  		break
  		case "RESIZE_BOARD":
  			this.getBoundary()
  		break
  		case "MOVE_PLAYER":
  			this.movePlayer(action.newLoc, playerLoc, dMap)
  		break
  		case "FIGHT_ENEMY":
  			this.fightEnemy(action.newLoc, enemies, player)
  		break
  		case "HEAL_PLAYER":
  			this.healPlayer(player, items)
  			this.movePlayer(action.newLoc, playerLoc, dMap)
  		break
  		case "NEW_WEAPON":
  			this.newWeapon(player, items.weapons, dungeonNr)
  			this.movePlayer(action.newLoc, playerLoc, dMap)
  		break
  		case "NEW_DUNGEON":
  			dungeonNr++
  			this.generateMap(dMap, mapSize, dungeonNr)
  		break
  	}
  }
}

const boardStore = new BoardStore
dispatcher.register(boardStore.handleActions.bind(boardStore))

export default boardStore
