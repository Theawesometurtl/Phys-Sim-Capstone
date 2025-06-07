import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';
import { Spring } from '../classes/Spring';
import { rotationAndScalarsToMatrix } from '../VectorFunctions';
import { SoftBody } from '../classes/SoftBody';

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

let softBody1 = new SoftBody(4,4,new Vector([300,300, 0]), true, true, true, true, 50)
// let softBody2 = new SoftBody(2,3,new Vector([500,500, 0]), false, false, true, true)

softBody1.physicsObjectArray.map((value: PhysicsObject) => {
  physicsObjectArray.push(value)})
softBody1.springArray.map((value: Spring) => {
  springArray.push(value)})
// softBody2.physicsObjectArray.map((value: PhysicsObject) => {
//   physicsObjectArray.push(value)})
// softBody2.springArray.map((value: Spring) => {
//   springArray.push(value)})


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

  physicsObjectArray.map((value: PhysicsObject, index: number) => {
      value.update(1)
      value.updateForces()
    //   value.shape.draw()
  })

  if (pressedKeys[32]) {
      springArray.map((value: Spring, index: number) => {
          value.draw(ctx)
        })

        physicsObjectArray.map((value: PhysicsObject, index: number) => {
          value.shape.draw()
        })
    }
    else {
        softBody1.draw(ctx)
        // softBody2.draw(ctx)
        
    }






}