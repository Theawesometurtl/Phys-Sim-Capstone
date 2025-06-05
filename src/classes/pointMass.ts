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
    extremeDrag: boolean

    /**
     * 
     * @param coords - The coordinates of the point mass in 3D space.
     */

    constructor(coords: Vector, linDrag: number = .999) {
        super(coords)
        this.extremeDrag = false
        this.velocity = new Vector([0,0,0])
        // this.rvelocity =  -1* Math.PI/100
        this.mass = 1
        this.force = new Vector([0, 0,0])
        this.invMass = this.mass**-1
        this.linDrag = .999
        this.momentum = new Vector([0,0,0])
        this.stateVectorLength = 6


    }

    stateVectorsToArray(): number[] {
        // console.log([...this.coords.values, ...this.momentum.values, ...this.force.values])

        return [...this.coords.values, ...this.momentum.values]
    }

    arrayToStateVectors(array: number[]): void {
        // console.log(array)

        this.coords = new Vector([array[0],array[1], array[2]])
        this.momentum = new Vector([array[3]*this.linDrag,array[4]*this.linDrag, array[5]*this.linDrag])


    }
    reset() {
        this.force = new Vector([0, 0, 0])

    }

    dydt(t: number = 0, y0: number[]): number[] {
        let dValues: number[] = []
        let accelValues = (this.force).values


        dValues[0] = y0[3]*this.invMass
        dValues[1] = y0[4]*this.invMass
        dValues[2] = y0[5]*this.invMass
        // dValues[2] = 0
        dValues[3] = accelValues[0] 
        dValues[4] = accelValues[1]
        // dValues[5] = 0
        dValues[5] = accelValues[2]

        return dValues
    }

    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   




}