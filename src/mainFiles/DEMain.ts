import './style.css'
import { canvas, ctx, fps } from '../globals';
import { Rigidbody } from '../classes/rigidbody';
import { Polygon } from '../classes/polygon';
import { Circle } from '../classes/circle';
import { Graph } from '../classes/graph';
import { PhysicsObject } from '../classes/PhysicsObject';
import { Matrix } from 'ts-matrix';

canvas.width = window.innerWidth/2 - 100
canvas.height = window.innerHeight/2 - 10
let canvas2: HTMLCanvasElement = document.getElementById("canvas2") as HTMLCanvasElement
let ctx2: CanvasRenderingContext2D = canvas2.getContext("2d") as CanvasRenderingContext2D;

let circleShape = new Circle()
let circleRB: Rigidbody = new Rigidbody([100, 100])
let circle = new PhysicsObject(circleShape, circleRB, true, true, true)
let canvasStaticBottomShape = new Polygon(new Matrix(2, 4, [[0, canvas.width, canvas.width, 0], [canvas.height, canvas.height, canvas.height+10000, canvas.height+10000]]))
let canvasStaticBottomRB: Rigidbody = new Rigidbody([canvas.width/2,canvas.height -10 + 5000])
let canvasStaticBottom = new PhysicsObject(canvasStaticBottomShape, canvasStaticBottomRB, false,false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)

let graph = new Graph(canvas2, ctx2)
// graph.draw(circleRB.dydt())

let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  circle.update(1)
  circle.draw()
  canvasStaticBottom.draw()
  canvasStaticBottom.update(1)
  
}