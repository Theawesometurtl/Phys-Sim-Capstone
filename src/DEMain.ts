import './style.css'
import { canvas, ctx, fps } from './globals';
import { Rigidbody } from './rigidbody';
import { rotateVector } from './rotateVector';
import { Polygon } from './polygon';
import { Circle } from './circle';
import { Graph } from './graph';

canvas.width = window.innerWidth/2 - 100
canvas.height = window.innerHeight/2 - 10
let canvas2: HTMLCanvasElement = document.getElementById("canvas2") as HTMLCanvasElement
let ctx2: CanvasRenderingContext2D = canvas2.getContext("2d") as CanvasRenderingContext2D;
export {ctx2, canvas2}

let circleShape = new Circle()
let circle: Rigidbody = new Rigidbody(circleShape, [100, 100], true, true, true)
let canvasStaticBottomShape = new Polygon([[0, canvas.height], [canvas.width, canvas.height], [canvas.width, canvas.height+10000], [0, canvas.height+10000]])
let canvasStaticBottom: Rigidbody = new Rigidbody(canvasStaticBottomShape,[canvas.width/2,canvas.height -10 + 5000],false,false, false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)

let graph = new Graph()
graph.draw()

let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  circle.update(1)
  circle.draw()
  canvasStaticBottom.draw()
  canvasStaticBottom.update(1)
  paint: Boolean;
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillStyle = "white"
  // ctx.fillRect(0,0,100,100)

}