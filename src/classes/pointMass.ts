import { Vector } from "ts-matrix"
import { gravity } from "../globals"
import { PhysicsComputer } from "./PhysicsComputer"
import { IncrementingValue } from "./Counter"
export class PointMass extends PhysicsComputer {
    velocity: Vector
    force: Vector
    mass: number
    invMass: number
    linDrag: number
    momentum: Vector

    constructor(coords: Vector) {
        super(coords)
        this.velocity = new Vector([0,0])
        // this.rvelocity =  -1* Math.PI/100
        this.mass = 1
        this.force = new Vector([0, 0])
        this.invMass = this.mass**-1
        this.linDrag = .999
        this.momentum = new Vector([0,0])
        this.stateVectorLength = 4

    }

    stateVectorsToArray(): number[] {
        // console.log([...this.coords.values, ...this.momentum.values, ...this.force.values])

        return [...this.coords.values, ...this.momentum.values]
    }

    arrayToStateVectors(array: number[]): void {
        // console.log(array)
        this.coords = new Vector([array[0],array[1]])
        this.momentum = new Vector([array[2],array[3]])

    }
    reset() {
        this.force = new Vector([0, 0])
    }

    dydt(t: number = 0, y0: number[]): number[] {
        let dValues: number[] = []
        let accelValues = (this.force).values


        dValues[0] = y0[2]*this.invMass
        dValues[1] = y0[3]*this.invMass
        dValues[2] = accelValues[0]
        dValues[3] = accelValues[1]
        return dValues
    }

    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   




}