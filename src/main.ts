import './style.css'
import { canvas, ctx, fps } from './globals';
import { Rigidbody } from './rigidbody';
import { rotateVector } from './rotateVector';
import { Polygon } from './polygon';
import { Circle } from './circle';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10
let square = new Polygon([[0, 0],[0,50],[50,50],[50,0]])
let polygon: Rigidbody = new Rigidbody(square, [200, 100], false, true, false)
let weirdShape = new Polygon([[0, 0],[0,50],[50,50],[50,0], [100, -100]])
let weird: Rigidbody = new Rigidbody(weirdShape,[400, 400], true, true, false)
let circleShape = new Circle()
let circle: Rigidbody = new Rigidbody(circleShape, [100, 100], true, true, true)
// let canvasStaticBottom: Rigidbody = new Rigidbody([[0, canvas.height], [canvas.width, canvas.height], [canvas.width, canvas.height+100], [0, canvas.height+100]],[0,0],false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  polygon.update(1)
  polygon.draw()
  polygon.energyCalc()
  weird.update(1)
  weird.draw()
  circle.update(1)
  circle.draw()
  paint: Boolean;
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillStyle = "white"
  // ctx.fillRect(0,0,100,100)

}