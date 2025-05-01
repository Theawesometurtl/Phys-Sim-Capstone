import './style.css'
import { canvas, ctx, fps } from './globals';

import { Graph } from './graph';
import { eulerODE, eulerODE10x } from './odes';


canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100


let graph = new Graph(canvas, ctx)

let interval = setInterval(() => main(), 1000/fps)
interval

function thing(x: number[]): number[] {
    return [(x[0] **2)/10]
}


function dydtThing(x: number[]) : number[] {
    return [2*x[0]]
}

function main() {
}
    graph.clear()
    graph.drawAxes()
    
    graph.drawEquation(thing)
    graph.drawEquation(dydtThing, "green")
    graph.drawODE(eulerODE10x, dydtThing, "blue")

  paint: Boolean;
  

  // ctx.fillRect(0,0,100,100)

