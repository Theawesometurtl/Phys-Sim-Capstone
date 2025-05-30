import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let circleShape1 = new Circle(50)
let sumoBot1PM: PointMass = new PointMass(new Vector([100, 100]))
let sumoBot1 = new PhysicsObject(circleShape1, sumoBot1PM, true, true, false)
let circleShape2 = new Circle(50)
let sumoBot2PM: PointMass = new PointMass(new Vector([100, 300]))
let sumoBot2 = new PhysicsObject(circleShape2, sumoBot2PM, false, true, false)

let physicsObjectArray: PhysicsObject[] = [sumoBot1, sumoBot2]



let interval = setInterval(() => main(), 1000/fps)
interval


function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

  sumoBot1.update(1)
  sumoBot1.draw()
  sumoBot2.update(1)
  sumoBot2.draw()
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
  }})



}