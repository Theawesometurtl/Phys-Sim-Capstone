import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10


// let circleShape = new Circle(100)
// let particlePM: PointMass = new PointMass(new Vector([canvas.width/2, canvas.height/2, 0]))
// let particle = new PhysicsObject(circleShape, particlePM, false, true, false)


let circleArray: PhysicsObject[] = []
let physicsObjectArray: PhysicsObject[] = []
let columns = 10
let rows = 10
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    let circleShape = new Circle(10)
    let particlePM: PointMass = new PointMass(new Vector([21 + i * 21 + j*0.01, 21 + j* 21 + i*0.01, 0]))
    let particle = new PhysicsObject(circleShape, particlePM, true, false, false, true)
    circleArray[i*columns + j] = particle
    physicsObjectArray[i*columns + j] = particle
    
    
  }
  
}
rows = 20
columns = 20

function getSplitPhysicsObjectArray() {
  let splitPhysicsObjectArray: PhysicsObject[][][] = []
  for (let i = 0; i < rows; i++) {
    splitPhysicsObjectArray[i] = []
    for (let j = 0; j < columns; j++) {
      splitPhysicsObjectArray[i][j] = []
      
      
    }
  }
  for (let i = 0; i < physicsObjectArray.length; i++) {
    let row = (Math.round(physicsObjectArray[i].computer.coords.values[1]* (rows/canvas.height)))%rows
    let column = (Math.round(physicsObjectArray[i].computer.coords.values[0]*(columns/canvas.width)))%columns
    splitPhysicsObjectArray[row][column].push(physicsObjectArray[i])
    
  }
  return splitPhysicsObjectArray
  
}
// physicsObjectArray.push(particle)
// physicsObjectArray.map((value: PhysicsObject, index: number) => 
// {
//   let i = Math.round(value.computer.coords.values[0]*rows/canvas.height)
//   let j = Math.round(value.computer.coords.values[0]*rows/canvas.height)
//   splitPhysicsObjectArray[i][j].push(value)
// })

let interval = setInterval(() => main(), 1000/fps)
interval


function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  circleArray.map((value: PhysicsObject, index: number) => 
    {
      value.updateForces()
      value.update(1)
    })
  // for (let i = 0; i < 1; i++) {
  //     physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
  //       generalCollisionResolver(value, physicsObjectArray[i])
  //     }})
    
    
  // }
  circleArray.map((value: PhysicsObject, index: number) => 
  {value.draw()
  })

  // particle.draw()
  
  
  for (let i = 0; i < 8; i++) 
{  
  let splitPhysicsObjectArray = getSplitPhysicsObjectArray()
  // console.log(splitPhysicsObjectArray)
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      splitPhysicsObjectArray[i][j].map((value1: PhysicsObject, index1: number) => {
        for (let k = -1; k < 2; k++) {
          for (let l = -1; l < 2; l++) {
            splitPhysicsObjectArray[(i + k + rows)%rows][(j + l + columns)%columns].map((value2: PhysicsObject, index2: number) => {
              // console.log((i + k + rows)%rows, (j + l + columns)%columns, index2, i, j, index1)
              generalCollisionResolver(value1, value2)
            })
          }
      // console.log(value, splitPhysicsObjectArray[i][j][k])
      
  }})}}}

    

  



}