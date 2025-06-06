import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';
import { Spring } from '../classes/Spring';
import { rotationAndScalarsToMatrix } from '../VectorFunctions';
import { Anchour } from '../classes/Anchour';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let circleShape1 = new Circle(25)
let circle1PM: PointMass = new PointMass(new Vector([100, 100, 0]), 0.98)
let circle1 = new PhysicsObject(circleShape1, circle1PM, true, false, true, true)
let circleShape2 = new Circle(25)
let circle2PM: PointMass = new PointMass(new Vector([100, 300, 0]), .99)
let circle2 = new PhysicsObject(circleShape2, circle2PM, false, true,  true, true)

let anchour = new Anchour(new Vector([300, 100, 0]))

let physicsObjectArray: PhysicsObject[] = [
  circle1, circle2
]
let springArray: Spring[] = [
new Spring(circle1, anchour, 200, 0.01),
new Spring(circle1, circle2, 200, 0.01)
]




let interval = setInterval(() => main(), 1000/fps)
interval


function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
  }})
  circle1.update(1)
  circle2.update(1)
  springArray.map((value: Spring, index: number) => {
    value.update()
  })
  anchour.draw()
  
  circle1.updateForces()
  circle1.draw()
  circle2.updateForces()
  circle2.draw()
  let rotMatrix2 = rotationAndScalarsToMatrix(Math.PI/2, circle1PM.momentum.values[0]/5, circle1PM.momentum.values[0]/2)
  let rotMatrix3 = rotationAndScalarsToMatrix(0, circle1PM.momentum.values[1]/5, circle1PM.momentum.values[1]/2)

  let rotMatrix1 = rotationAndScalarsToMatrix(Math.atan2(circle1PM.momentum.values[0],circle1PM.momentum.values[1]), circle1PM.momentum.length()/5, circle1PM.momentum.length()/2)
  springArray.map((value: Spring, index: number) => {value.draw(ctx)})
  // let arrowTip
  // if (pressedKeys[32]) {
  //   arrowTip = circle1.shape.drawArrow(circle1.coords.values[0], circle1.coords.values[1], rotMatrix2)
  //   arrowTip = circle1.shape.drawArrow(arrowTip[0], arrowTip[1], rotMatrix3)
  // }
  // else {
  //   arrowTip = circle1.shape.drawArrow(circle1.coords.values[0],circle1.coords.values[1], rotMatrix1)

  // }

  // let rotMatrix4 = rotationAndScalarsToMatrix(Math.atan2(circle1PM.force.values[0],circle1PM.force.values[1]), circle1PM.force.length()*4, circle1PM.force.length()*10)
  // circle1.shape.drawArrow(arrowTip[0], arrowTip[1], rotMatrix4, "red")


}