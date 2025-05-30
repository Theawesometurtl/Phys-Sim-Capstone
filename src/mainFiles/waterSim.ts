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
    let particlePM: PointMass = new PointMass(new Vector([21 + i * 21, 21 + j* 21, 0]))
    let particle = new PhysicsObject(circleShape, particlePM, true, false, true)
    circleArray[i*columns + j] = particle
    physicsObjectArray[i*columns + j] = particle
    
    
  }
  
}
rows = 5
columns = 10
let splitPhysicsObjectArray: PhysicsObject[][][] = []
for (let i = 0; i < rows; i++) {
  splitPhysicsObjectArray[i] = []
  for (let j = 0; j < columns; j++) {
    splitPhysicsObjectArray[i][j] = []


  }
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
  {value.draw()
  value.update(1)})
  // particle.draw()
  // console.log(splitPhysicsObjectArray)
  // for (let i = 0; i < rows; i++) {
  //   for (let j = 0; j < columns; j++) {
  //     splitPhysicsObjectArray[i][j].map((value: PhysicsObject, index: number) => {
  //       let properRow = Math.round(value.computer.coords.values[0]*rows/canvas.height)
  //       let properColumn = Math.round(value.computer.coords.values[0]*rows/canvas.height)
  //       if (properRow != i || properColumn!= j) { 
  //         splitPhysicsObjectArray[properRow][properColumn].push(value)
  //         splitPhysicsObjectArray[i][j].splice(index, 1)
  //       }
  //       for (let k = index+1; k < splitPhysicsObjectArray[i][j].length; k++) {
  //     // console.log(value, splitPhysicsObjectArray[i][j][k])
  //     generalCollisionResolver(value, splitPhysicsObjectArray[i][j][k])
      
  // }})}}

    
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
  }})

  



}