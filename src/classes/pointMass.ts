import { Vector } from "ts-matrix"
import { gravity } from "../globals"
import { PhysicsComputer } from "./PhysicsComputer"
import { IncrementingValue } from "./Counter"
import { rungeKutta4thOrder } from "../odes"
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
        this.force = new Vector([0,0])
        this.mass = 1
        this.invMass = this.mass**-1
        this.linDrag = .999
        this.momentum = this.velocity.scale(this.mass)
        this.stateVectorLength = 4

    }

    stateVectorsToArray(): number[] {
        console.log([...this.coords.values, ...this.momentum.values, ...this.force.values])

        return [...this.coords.values, ...this.momentum.values]
    }

    arrayToStateVectors(array: number[]): void {
        let i = new IncrementingValue()
        console.log(array)
        this.coords = new Vector([array[i.value],array[i.value]])
        this.momentum = new Vector([array[i.value],array[i.value]])

    }
    update() {
        this.force = new Vector([0,-gravity*this.mass])
    }

    dydt(t: number = 0, y0: number[]): number[] {
        let dValues: number[] = []
        let i = new IncrementingValue()
        let accelValues = (this.force.scale(this.invMass)).values
        this.velocity = this.momentum.scale(this.invMass)

        dValues[i.value] = this.velocity.values[0]
        dValues[i.value] = this.velocity.values[1]
        dValues[i.value] = accelValues[0]
        dValues[i.value] = accelValues[1]
        return dValues
    }

    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   




}