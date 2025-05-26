import '../css/style.css'
import { canvas, ctx, fps } from '../globals';
import { Rigidbody } from '../classes/rigidbody';
import { Polygon } from '../classes/polygon';
import { Circle } from '../classes/circle';
import { PhysicsObject } from '../classes/PhysicsObject';
import { Matrix, Vector } from 'ts-matrix';
import { PointMass } from '../classes/pointMass';


canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let circleShape = new Circle()
let circlePM: PointMass = new PointMass(new Vector([100, 100]))
let circle = new PhysicsObject(circleShape, circlePM, true, true, true)
// let canvasStaticBottom: Rigidbody = new Rigidbody([[0, canvas.height], [canvas.width, canvas.height], [canvas.width, canvas.height+100], [0, canvas.height+100]],[0,0],false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

  circle.update(1)
  circle.draw()


}