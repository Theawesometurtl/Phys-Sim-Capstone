import './style.css'
import { canvas, ctx, fps } from './constants';
import { Polygon } from './polygon';
import { rotateVector } from './rotateVector';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10
let polygon: Polygon = new Polygon([[0, 0],[0,50],[50,50],[50,0]],[200, 100], false)
let weirdShape: Polygon = new Polygon([[0, 0],[0,50],[50,50],[50,0], [25, -100]],[400, 400], true)
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  polygon.update(1)
  polygon.draw()
  polygon.energyCalc()
  weirdShape.update(1)
  weirdShape.draw()
  paint: Boolean;
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillStyle = "white"
  // ctx.fillRect(0,0,100,100)

}