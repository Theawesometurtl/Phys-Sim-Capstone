import './style.css'
import { canvas, ctx, fps } from './constants';
import { Polygon } from './polygon';
import { rotateVector } from './rotateVector';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10
let polygon: Polygon = new Polygon([[0, 0],[0,50],[50,50],[50,0]],[100, 100])
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  polygon.update()
  polygon.draw()
  polygon.energyCalc()
  paint: Boolean;
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillStyle = "white"
  // ctx.fillRect(0,0,100,100)

}