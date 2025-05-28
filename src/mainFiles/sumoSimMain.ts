import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let circleShape1 = new Circle()
let sumoBot1PM: PointMass = new PointMass(new Vector([100, 100]))
let sumoBot1 = new PhysicsObject(circleShape1, sumoBot1PM, true, true, false)
let circleShape2 = new Circle()
let sumoBot2PM: PointMass = new PointMass(new Vector([100, 100]))
let sumoBot2 = new PhysicsObject(circleShape2, sumoBot2PM, false, true, false)

let interval = setInterval(() => main(), 1000/fps)
interval
let y0 = [100, 100, 1, 0, 1, 0]
let y1 = sumoBot2PM.ode(y0, 4,0,1)
console.log(y1)
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

  sumoBot1.update(1)
  sumoBot1.draw()
  // sumoBot2.update(1)
  // sumoBot2.draw()

}