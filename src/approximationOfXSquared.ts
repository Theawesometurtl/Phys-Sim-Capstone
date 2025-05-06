import { Graph } from './classes/graph';
import { euler, backwardsEuler, StateVectorPredictor, modifiedEuler, rungeKutta4thOrder } from './odes';



function thing(x: number[]): number[] {
    return [(x[0] **2)/50]
}

function dStateVector(t: number, y: number[]): number[] {
    return [(t)/25]
}


export function approximateXSquared(graph: Graph) { 
    graph.drawEquation(thing)
    graph.drawDifferential(dStateVector, "green")

    let eulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => euler(y0, len, t0, t1, dStateVector);
    let backwardsEulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => backwardsEuler(y0, len, t0, t1, dStateVector);
    let modifiedEulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => modifiedEuler(y0, len, t0, t1, dStateVector);
    let rungeKutta4thOrderStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => rungeKutta4thOrder(y0, len, t0, t1, dStateVector);
    
    // graph.drawODE(eulerStateVectorPredictor, "green")
    // graph.drawODE(backwardsEulerStateVectorPredictor, "red")
    // graph.drawODE(modifiedEulerStateVectorPredictor, "yellow")
    graph.drawODE(rungeKutta4thOrderStateVectorPredictor, "blue")
}