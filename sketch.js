const MAZE_SIZE = 10
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
        if (y < MAZE_SIZE-1)
          this.grid[y+1][x] &= ~Maze.BIT_UP
        break;
      case Maze.LEFT:
        this.grid[y][x] &= ~Maze.BIT_LEFT
        if (x > 0)
          this.grid[y][x-1] &= ~Maze.BIT_RIGHT
        break;
      case Maze.RIGHT:
        this.grid[y][x] &= ~Maze.BIT_RIGHT
        if (x < MAZE_SIZE-1)
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
        if (y < MAZE_SIZE-1) 
          this.grid[y+1][x] |= Maze.BIT_UP
        break;
      case Maze.LEFT:
        this.grid[y][x] |= Maze.BIT_LEFT
        if (x > 0) 
          this.grid[y][x-1] |= Maze.BIT_RIGHT
        break;
      case Maze.RIGHT:
        this.grid[y][x] |= Maze.BIT_RIGHT
        if (x < MAZE_SIZE-1) 
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
}

class NewMaze

// duck typing moment
class RandDFS {
  pointer = {x:0, y:0}
  history = []

  constructor(maze, xInit=0, yInit=0) {
    this.maze = maze
    this.pointer.x = xInit
    this.pointer.y = yInit
  }

  tick() {
    let walls = []
    for (const i of Array(4).keys()) {
      if (this.maze.hasWall(this.pointer.x, this.pointer.y, i) 
          && this.maze.hasCell(this.pointer.x, this.pointer.y, i)
          && !this.maze.isFilled(this.pointer.x, this.pointer.y, i))
        walls.push(i)
    }
    if (walls.length == 0) {
      if (this.history.length == 0)
        return
      this.maze.fill(this.pointer.x, this.pointer.y)
      this.pointer = this.history.pop()
    } else {
      let rand = walls[Math.floor(Math.random()*walls.length)]
      this.maze.fill(this.pointer.x, this.pointer.y)
      this.maze.removeWall(this.pointer.x, this.pointer.y, rand)
      this.history.push(structuredClone(this.pointer))
      switch (rand) {
        case Maze.TOP:
          this.pointer.y--
          break;
        case Maze.BOTTOM:
          this.pointer.y++
          break;
        case Maze.LEFT:
          this.pointer.x--
          break;
        case Maze.RIGHT:
          this.pointer.x++
          break;
      }  
    }
  }
}


class RandPrim {

}


function drawMaze(maze) {
  for (const y of maze.grid.keys()) {
    for (const x of maze.grid[y].keys()) {
      push()
      strokeWeight(0);
      if (maze.isFilled(x,y))
        rect(CELL_SIZE*x, CELL_SIZE*y, CELL_SIZE, CELL_SIZE)
      pop()
      if (maze.hasWall(x,y,Maze.TOP))
        line(CELL_SIZE*x, CELL_SIZE*y, CELL_SIZE*(x+1), CELL_SIZE*y)
      if (maze.hasWall(x,y,Maze.BOTTOM))
        line(CELL_SIZE*x, CELL_SIZE*(y+1), CELL_SIZE*(x+1), CELL_SIZE*(y+1))
      if (maze.hasWall(x,y,Maze.LEFT))
        line(CELL_SIZE*x, CELL_SIZE*y, CELL_SIZE*x, CELL_SIZE*(y+1))
      if (maze.hasWall(x,y,Maze.RIGHT))
        line(CELL_SIZE*(x+1), CELL_SIZE*y, CELL_SIZE*(x+1), CELL_SIZE*(y+1))
    }
  }
}

function drawPointer(pointer) {
  push()
  fill(250, 149, 73)
  circle(CELL_SIZE*pointer.x+CELL_SIZE/2, CELL_SIZE*pointer.y+CELL_SIZE/2, CELL_SIZE/3)
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
  alg = new RandDFS(maze, 3,5)
  console.log(maze.grid)
}

function draw() {
  background(30);
  drawMaze(maze)
  drawPointer(alg.pointer)
  alg.tick()
}



