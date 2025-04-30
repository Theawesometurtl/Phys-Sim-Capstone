import './style.css'
import { canvas, ctx, fps } from './globals';

import { Graph } from './graph';


let canvas2: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
let ctx2: CanvasRenderingContext2D = canvas2.getContext("2d") as CanvasRenderingContext2D;
export {ctx2, canvas2}
canvas2.width = window.innerWidth - 100
canvas2.height = window.innerHeight - 100


let graph = new Graph()

let interval = setInterval(() => main(), 1000/fps)
interval

function thing(x: number): number {
    return x **2
}

function dydtThing(x: number) : number {
    return 2*x
}
function main() {
    graph.clear()
    graph.drawAxes()
    
    graph.drawEquation(thing)

  paint: Boolean;
  
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.fillStyle = "white"
  // ctx.fillRect(0,0,100,100)

}