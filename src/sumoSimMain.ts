import './style.css'
import { canvas, ctx, fps } from './constants';
import { Polygon } from './polygon';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10
let circle: Polygon = new Polygon([[0, 0],[0,50],[50,50],[50,0]],[200, 100], false)
let weirdShape: Polygon = new Polygon([[0, 0],[0,50],[50,50],[50,0], [100, -100]],[400, 400], true)
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillStyle = "white"
  // ctx.fillRect(0,0,100,100)

}