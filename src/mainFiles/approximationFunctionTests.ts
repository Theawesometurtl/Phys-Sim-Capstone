import '../css/style.css'
import { canvas, ctx, fps } from '../globals';

import { Graph } from '../classes/graph';
import { euler, backwardsEuler, StateVectorPredictor } from '../odes';



canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100


let graph = new Graph(canvas, ctx)

let interval = setInterval(() => main(), 1000/fps)
interval

function thing(x: number[]): number[] {
    return [(x[0] **2)/10]
}


function dStateVector(y: number[], t: number) : number[] {
    return [y[0]/5]
}

function main() {
}
    graph.clear()
    graph.drawAxes()
    
    graph.drawEquation(thing)
    graph.drawDifferential(dStateVector, "green")

    let eulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => euler(y0, len, t0, t1, dStateVector);
    let backwardsEulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => euler(y0, len, t0, t1, dStateVector);
    let modifiedEulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => euler(y0, len, t0, t1, dStateVector);
    let rungeKutta4thOrderStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => euler(y0, len, t0, t1, dStateVector);
    
    // graph.drawODE(backwardsEulerStateVectorPredictor, "red")
    // graph.drawODE(rungeKutta4thOrderStateVectorPredictor, "blue")



