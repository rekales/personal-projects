const MAZE_SIZE = 20
const CANVAS_SIZE = 300
const CELL_SIZE = CANVAS_SIZE/MAZE_SIZE


// Fuck OOP
// All my homies hate OOP

class Maze {
  static BIT_UP = 1
  static BIT_DOWN = 2
  static BIT_LEFT = 4
  static BIT_RIGHT = 8
  static BIT_FILL = 16
  static BIT_MAX = 31

  // direction enums
  static TOP = 0
  static BOTTOM = 1
  static LEFT = 2
  static RIGHT = 3
    
  constructor(size) {
    this.size = size
    this.grid = Array(size).fill().map(() => Array(size).fill(15))
  }


  hasWall(x, y, direction) {
    switch(direction) {
      case Maze.TOP:
        return (this.grid[y][x] & Maze.BIT_UP) > 0
      case Maze.BOTTOM:
        return (this.grid[y][x] & Maze.BIT_DOWN) > 0
      case Maze.LEFT:
        return (this.grid[y][x] & Maze.BIT_LEFT) > 0
      case Maze.RIGHT:
        return (this.grid[y][x] & Maze.BIT_RIGHT) > 0
    }
  }

  removeWall(x, y, direction) {
    switch(direction) {
      case Maze.TOP:
        this.grid[y][x] &= ~Maze.BIT_UP
        if (y > 0) 
          this.grid[y-1][x] &= ~Maze.BIT_DOWN
        break;
      case Maze.BOTTOM:
        this.grid[y][x] &= ~Maze.BIT_DOWN
        if (y < this.size-1)
          this.grid[y+1][x] &= ~Maze.BIT_UP
        break;
      case Maze.LEFT:
        this.grid[y][x] &= ~Maze.BIT_LEFT
        if (x > 0)
          this.grid[y][x-1] &= ~Maze.BIT_RIGHT
        break;
      case Maze.RIGHT:
        this.grid[y][x] &= ~Maze.BIT_RIGHT
        if (x < this.size-1)
          this.grid[y][x+1] &= ~Maze.BIT_LEFT
        break;
    }
  }

  addWall(x, y, direction) {
    switch(direction) {
      case Maze.TOP:
        this.grid[y][x] |= Maze.BIT_UP
        if (y > 0) 
          this.grid[y-1][x] |= Maze.BIT_DOWN
        break;
      case Maze.BOTTOM:
        this.grid[y][x] |= Maze.BIT_DOWN
        if (y < this.size-1) 
          this.grid[y+1][x] |= Maze.BIT_UP
        break;
      case Maze.LEFT:
        this.grid[y][x] |= Maze.BIT_LEFT
        if (x > 0) 
          this.grid[y][x-1] |= Maze.BIT_RIGHT
        break;
      case Maze.RIGHT:
        this.grid[y][x] |= Maze.BIT_RIGHT
        if (x < this.size-1) 
          this.grid[y][x+1] |= Maze.BIT_LEFT
        break;
    }
  }

  hasCell(x, y, direction) {
    switch(direction) {
      case Maze.TOP:
        return y>0
      case Maze.BOTTOM:
        return y<this.size-1
      case Maze.LEFT:
        return x>0
      case Maze.RIGHT:
        return x<this.size-1
    }
  }

  // returns [x,y]
  getCell(x, y, direction) {
    switch(direction) {
      case Maze.TOP:
        return [x, y-1]
      case Maze.BOTTOM:
        return [x, y+1]
      case Maze.LEFT:
        return [x-1, y]
      case Maze.RIGHT:
        return [x+1, y]
    }
  }

  isFilled(x, y, direction=-1) {
    switch(direction) {
      case Maze.TOP:
        return (this.grid[y-1][x] & Maze.BIT_FILL) > 0
      case Maze.BOTTOM:
        return (this.grid[y+1][x] & Maze.BIT_FILL) > 0
      case Maze.LEFT:
        return (this.grid[y][x-1] & Maze.BIT_FILL) > 0
      case Maze.RIGHT:
        return (this.grid[y][x+1] & Maze.BIT_FILL) > 0
      case -1:
        return (this.grid[y][x] & Maze.BIT_FILL) > 0
    }
  }

  fill(x,y) {
    this.grid[y][x] |= Maze.BIT_FILL
  }

  render() {
    for (const y of this.grid.keys()) {
      for (const x of this.grid[y].keys()) {
        push()
        strokeWeight(0);
        if (this.isFilled(x,y))
          rect(CELL_SIZE*x, CELL_SIZE*y, CELL_SIZE, CELL_SIZE)
        pop()
        if (this.hasWall(x,y,Maze.TOP))
          line(CELL_SIZE*x, CELL_SIZE*y, CELL_SIZE*(x+1), CELL_SIZE*y)
        if (this.hasWall(x,y,Maze.BOTTOM))
          line(CELL_SIZE*x, CELL_SIZE*(y+1), CELL_SIZE*(x+1), CELL_SIZE*(y+1))
        if (this.hasWall(x,y,Maze.LEFT))
          line(CELL_SIZE*x, CELL_SIZE*y, CELL_SIZE*x, CELL_SIZE*(y+1))
        if (this.hasWall(x,y,Maze.RIGHT))
          line(CELL_SIZE*(x+1), CELL_SIZE*y, CELL_SIZE*(x+1), CELL_SIZE*(y+1))
      }
    }
  }
}

class NewMaze {
  grid = []

  constructor (size, xinit, yInit) {

  }


}

// duck typing moment
class RandDFS {
  current = []
  pointer = {x:0, y:0}
  history = []

  constructor(maze, xInit=0, yInit=0) {
    this.maze = maze
    this.current[0] = xInit
    this.current[1] = yInit
  }

  tick() {
    let walls = []
    for (const i of Array(4).keys()) {
      if (this.maze.hasWall(this.current[0], this.current[1], i) 
          && this.maze.hasCell(this.current[0], this.current[1], i)
          && !this.maze.isFilled(this.current[0], this.current[1], i))
        walls.push(i)
    }
    if (walls.length == 0) {
      if (this.history.length == 0)
        return
      this.maze.fill(this.current[0], this.current[1])
      this.pointer = this.history.pop()
    } else {
      let rand = walls[Math.floor(Math.random()*walls.length)]
      this.maze.fill(this.current[0], this.current[1])
      this.maze.removeWall(this.current[0], this.current[1], rand)
      this.history.push(structuredClone(this.pointer))
      this.current = this.maze.getCell(this.current[0], this.current[1], rand)
    }
  }

  render() {
    push()
    fill(250, 149, 73)
    circle(CELL_SIZE*this.current[0]+CELL_SIZE/2, CELL_SIZE*this.current[1]+CELL_SIZE/2, CELL_SIZE/3)
    pop()
  }
}


class RandPrim {
  frontier = []

  constructor(maze, xInit=0, yInit=0) {
    this.maze = maze

    this.maze.fill(xInit, yInit)
    for (const i of Array(4).keys()) {
      if (this.maze.hasWall(xInit, yInit, i) 
          && this.maze.hasCell(xInit, yInit, i)
          && !this.maze.isFilled(xInit, yInit, i))
        this.frontier.push(this.maze.getCell(xInit, yInit, i))
    }
  }

  tick() {
    if (this.frontier.length == 0) return
    do {
      var rand = this.frontier.splice(Math.floor(Math.random()*this.frontier.length), 1)[0]
      if (this.frontier.length == 0) return
    } while (this.maze.isFilled(rand[0], rand[1]))
    this.maze.fill(rand[0], rand[1])

    let targets = []
    for (const i of Array(4).keys()) {
      if (this.maze.hasWall(rand[0], rand[1], i) && this.maze.hasCell(rand[0], rand[1], i)) {
        if (this.maze.isFilled(rand[0], rand[1], i))
          targets.push(i)
        else
          this.frontier.push(this.maze.getCell(rand[0], rand[1], i))
      }
    }
    this.maze.removeWall(rand[0], rand[1], targets[Math.floor(Math.random()*targets.length)])

    console.log(this.frontier)
    console.log(rand)
  }

  render() {

  }
}

// class HuntKill {
//   hunt = false
//   current = [0,0]

//   constructor(maze, xInit=0, yInit=0) {
//     this.maze = maze
//     this.current[0] = xInit
//     this.current[y] = yInit

//   }

//   tick() {
//     if (hunt) {
//       if (this.maze.isFilled(this.current[0], this.current[1])) {

//       } else {
        
//       }
//       return
//     }

//     let walls = []
//     for (const i of Array(4).keys()) {
//       if (this.maze.hasWall(this.current[0], this.current[1], i) 
//           && this.maze.hasCell(this.current[0], this.current[1], i)
//           && !this.maze.isFilled(this.current[0], this.current[1], i))
//         walls.push(i)
//     }
//     if (walls.length == 0) {
//       this.maze.fill(this.current[0], this.current[1])
//       current = [0,0]
//       hunt = true
//     } else {
//       let rand = walls[Math.floor(Math.random()*walls.length)]
//       this.maze.fill(this.current[0], this.current[1])
//       this.maze.removeWall(this.current[0], this.current[1], rand)
//       this.current = this.maze.getCell(this.current[0], this.current[1], rand)
//     }
//   }

//   render() {

//   }
// }

class EllersAlg {
  row = 0
  sets = this.grid = Array(size).fill().map(() => Array(size).fill(0))
  current = [0,0]
  

  constructor(maze, xInit=0, yInit=0) {
    this.maze = maze
    currentRow = Array(maze.size).fill(0)
    nextRow = Array(maze.size).fill(0)

  }

  tick() {
    // this.currentRow = 
  }

  render() {

  }
}


function drawPointer(pointer) {
  push()
  fill(250, 149, 73)
  circle(CELL_SIZE*current[0]+CELL_SIZE/2, CELL_SIZE*current[1]+CELL_SIZE/2, CELL_SIZE/3)
  pop()
}


let maze
let alg
function setup() {
  createCanvas(CANVAS_SIZE, CANVAS_SIZE);
  background(30);
  strokeWeight(4); 
  stroke(160);
  fill(60)
  frameRate(60);

  maze = new Maze(MAZE_SIZE)
  alg = new RandPrim(maze, 2,2)
  console.log(maze.grid)
}

function draw() {
  background(30);
  maze.render()
  alg.render()
  alg.tick()
}



