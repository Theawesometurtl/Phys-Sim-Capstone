import { Graph } from './classes/graph';
import { euler, backwardsEuler, StateVectorPredictor, modifiedEuler, rungeKutta4thOrder } from './odes';



function thing(x: number[]): number[] {
    return [(x[0] **2)/50]
}

function dThing(t: number, y: number[]): number[] {
    return [(t)/25]
}

function dStateVector( t: number,y: number[]) : number[] {
    if (t != 0) {
        return [(y[0]/25) * (t/Math.abs(t))]

    }
    else {
        console.log("t == 0")
        return [(y[0]/25)]
    }
}

export function approximateXSquared(graph: Graph) { 
    graph.drawEquation(thing)
    graph.drawDifferential(dStateVector, "green")

    let eulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => euler(y0, len, t0, t1, dStateVector);
    let backwardsEulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => backwardsEuler(y0, len, t0, t1, dStateVector);
    let modifiedEulerStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => modifiedEuler(y0, len, t0, t1, dStateVector);
    let rungeKutta4thOrderStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => rungeKutta4thOrder(y0, len, t0, t1, dStateVector);
    let rungeKutta4thOrderStateVectorPredictorCheat: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => rungeKutta4thOrder(y0, len, t0, t1, dThing);
    
    graph.drawODE(eulerStateVectorPredictor, "green")
    graph.drawODE(backwardsEulerStateVectorPredictor, "red")
    graph.drawODE(modifiedEulerStateVectorPredictor, "yellow")
    graph.drawODE(rungeKutta4thOrderStateVectorPredictor, "blue")
    graph.drawODE(rungeKutta4thOrderStateVectorPredictorCheat, "orange")
}