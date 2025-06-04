import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';
import { Spring } from '../classes/Spring';
import { rotationAndScalarsToMatrix } from '../VectorFunctions';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

const sqrt2 = Math.sqrt(2)
let circleShape1 = new Circle(25)
let circle1PM: PointMass = new PointMass(new Vector([100, 100, 0]))
let circle1 = new PhysicsObject(circleShape1, circle1PM, true, false, true, true)
let circleShape2 = new Circle(25)
let circle2PM: PointMass = new PointMass(new Vector([100, 300, 0]))
let circle2 = new PhysicsObject(circleShape2, circle2PM, false, true,  true, true)

let physicsObjectArray: PhysicsObject[] = [
//   circle1, 
//   circle2
]
let springArray: Spring[] = [
//   new Spring(circle1, circle2, 100, 0.001)
]
const directions = [
    [-1, -1, Math.sqrt(2)], [-1, 0, 1], [-1, 1, Math.sqrt(2)],
    [ 0, -1, 1],          [ 0, 1, 1],
    [ 1, -1, Math.sqrt(2)], [ 1, 0, 1], [ 1, 1, Math.sqrt(2)],
  ];
let columns = 2
let rows = 2
let spacing = 100
let circleRatio = .25
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
      let circleShape = new Circle(spacing*circleRatio)
      let particlePM: PointMass = new PointMass(new Vector([spacing + i * spacing + 0.01*spacing*j, spacing + j* spacing + 0.01*spacing*i, 0]))
      let particle = new PhysicsObject(circleShape, particlePM, true, false, true, true)
      physicsObjectArray[i*columns + j] = particle
      
    }
}
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
        for (const [dx, dy, magnitude] of directions) {

        const ni = i + dx;
        const nj = j + dy;

        // Bounds check
        if (ni >= 0 && ni < rows && nj >= 0 && nj < columns) {
            // Only add one direction to avoid duplicates
            if (ni > i || (ni === i && nj > j)) {
            let neighbor = physicsObjectArray[ni * columns + nj];
            let particle = physicsObjectArray[i * columns + j];
            let spring = new Spring(particle, neighbor, spacing*magnitude*1.5, 0.01*magnitude);
            springArray.push(spring);
            }
        }
        }
    }
}


let interval = setInterval(() => main(), 1000/fps)
interval


function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
}})
springArray.map((value: Spring, index: number) => {
  value.update()
//   value.draw(ctx)
})
ctx.beginPath()
ctx.fillStyle = "red"
ctx.moveTo(physicsObjectArray[0].shape.coords.values[0] - spacing*(circleRatio), physicsObjectArray[0].shape.coords.values[1] - spacing*(circleRatio))
ctx.lineTo(physicsObjectArray[1].shape.coords.values[0] - spacing*(circleRatio), physicsObjectArray[1].shape.coords.values[1] + spacing*(circleRatio))
ctx.lineTo(physicsObjectArray[3].shape.coords.values[0] + spacing*(circleRatio), physicsObjectArray[3].shape.coords.values[1] + spacing*(circleRatio))
ctx.lineTo(physicsObjectArray[2].shape.coords.values[0] + spacing*(circleRatio), physicsObjectArray[2].shape.coords.values[1] - spacing*(circleRatio)) 
ctx.closePath()
ctx.fill()
  physicsObjectArray.map((value: PhysicsObject, index: number) => {
      value.update(1)
    //   value.shape.draw()
  })



//   circle1.update(1)
//   circle1.draw()
//   let rotMatrix1 = rotationAndScalarsToMatrix(Math.PI/2, circle1PM.momentum.values[0]/5, circle1PM.momentum.values[0]/2)
//   let rotMatrix2 = rotationAndScalarsToMatrix(0, circle1PM.momentum.values[1]/5, circle1PM.momentum.values[1]/2)
  
//   circle2.update(1)
//   circle2.draw()
//   let rotMatrix = rotationAndScalarsToMatrix(Math.atan2(circle1PM.momentum.values[0],circle1PM.momentum.values[1]), circle1PM.momentum.length()/5, circle1PM.momentum.length()/2)
//   if (pressedKeys[32]) {
//     let arrowTip = circle1.shape.drawArrow(circle1.coords.values[0], circle1.coords.values[1], rotMatrix1)
//     circle1.shape.drawArrow(arrowTip[0], arrowTip[1], rotMatrix2)
//   }
//   else {
//     circle1.shape.drawArrow(circle1.coords.values[0],circle1.coords.values[1], rotMatrix)

//   }




}