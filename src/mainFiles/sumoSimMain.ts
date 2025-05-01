import './style.css'
import { canvas, ctx, fps } from '../globals';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)


}