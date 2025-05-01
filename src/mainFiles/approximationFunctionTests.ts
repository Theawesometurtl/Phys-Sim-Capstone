import './style.css'
import { canvas, ctx, fps } from '../globals';

import { Graph } from '../classes/graph';
import { eulerODE, eulerODE10x, StateVectorPredictor } from '../odes';



canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100


let graph = new Graph(canvas, ctx)

let interval = setInterval(() => main(), 1000/fps)
interval

function thing(x: number[]): number[] {
    return [(x[0] **2)/10]
}


function dStateVector(y: number[], t: number) : number[] {
    return [2*y[0]]
}

function main() {
}
    graph.clear()
    graph.drawAxes()
    
    graph.drawEquation(thing)
    graph.drawDifferential(dStateVector, "green")

    let eulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => eulerODE(y0, len, t0, t1, dStateVector);

    graph.drawODE(eulerStateVectorPredictor, "blue")



