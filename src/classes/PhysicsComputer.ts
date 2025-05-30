import { Vector } from "ts-matrix";
import { OrdinaryDifferentialEquationSolver, rungeKutta4thOrder, StateVectorDerivatives, StateVectorPredictor } from "../odes";

export class PhysicsComputer {
coords: Vector
ode: StateVectorPredictor
force: Vector
momentum: Vector
velocity: Vector
stateVectorLength: number
    constructor(coords: Vector) {
        this.force = new Vector([0,0, 0])
        this.momentum = new Vector([0,0, 0])
        this.velocity = new Vector([0,0, 0])
        this.coords = coords
        this.ode = (y0: number[], len: number, t0: number, t1: number) => rungeKutta4thOrder(y0, len, t0, t1, this.dydt.bind(this));
        this.stateVectorLength = 0
        
    }
    stateVectorsToArray(): number[] {
        console.error("empty parent method run")
        return []
    }
    arrayToStateVectors(array: number[]): void {
        console.error("empty parent method run")
        
    }
    dydt(t: number = 0, y: number[]): number[] { 
        console.error("empty parent method run")
        return []
    }
    reset() {
        console.error("empty parent method run")
    }
}