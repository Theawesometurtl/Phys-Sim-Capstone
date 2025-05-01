import { Vector } from "ts-matrix"
import { gravity } from "../globals"
export class PointMass {
    velocity: Vector
    force: Vector
    mass: number
    invMass: number
    linDrag: number
    momentum: Vector

    constructor(
     ) {
        this.velocity = new Vector([0,0])
        // this.rvelocity =  -1* Math.PI/100
        this.force = new Vector([0,0])
        this.mass = 1
        this.invMass = this.mass**-1
        this.linDrag = .999
        this.momentum = this.velocity.scale(this.mass)
    }

    update() {
        this.force = new Vector([0,-gravity*this.mass])
    }

    dydt(coords: Vector, velocity: Vector) {
        return [velocity, this.force.scale(this.invMass)]
    }

    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   




}