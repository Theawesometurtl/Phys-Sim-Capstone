import './style.css'
import { canvas, ctx, fps } from '../globals';
import { Rigidbody } from '../classes/rigidbody';
import { Polygon } from '../classes/polygon';
import { Circle } from '../classes/circle';
import { PhysicsObject } from '../classes/PhysicsObject';
import { Matrix } from 'ts-matrix';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10
let square = new Polygon(new Matrix(2, 4, [[0, 0, 50, 50], [0, 50, 50, 0]]))
let polygonRB: Rigidbody = new Rigidbody([200, 100])
let polygon: PhysicsObject = new PhysicsObject(square, polygonRB, false, true, false)
let weirdShape = new Polygon(new Matrix(2, 5, [[0, 0,50,50,100],[0,50,50,0,-100]]))
let weirdRB: Rigidbody = new Rigidbody([400, 400])
let weird: PhysicsObject = new PhysicsObject(weirdShape,weirdRB, true, true, false)
let circleShape = new Circle()
let circleRB: Rigidbody = new Rigidbody([100, 100])
let circle: PhysicsObject = new PhysicsObject(circleShape, circleRB, false, true, false)
// let canvasStaticBottom: Rigidbody = new Rigidbody([[0, canvas.height], [canvas.width, canvas.height], [canvas.width, canvas.height+100], [0, canvas.height+100]],[0,0],false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  polygon.update(1)
  polygon.draw()
  weird.update(1)
  weird.draw()
  circle.update(1)
  circle.draw()


}