import { Vector } from "ts-matrix"
import { rotateVector } from "./rotateVector"
import { gravity } from "./globals"
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

    velocityOfPoint(relativePoint: number[]) {
        let instantaneousRotationVector = rotateVector(Math.PI/2, relativePoint)
        let vOfPoint = [-this.velocity.values[0] + instantaneousRotationVector[0], -this.velocity.values[1]+ instantaneousRotationVector[1] ]
        return vOfPoint
    }

    dydt(coords: Vector, velocity: Vector) {
        return [velocity, this.force.scale(this.invMass)]
    }

    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   

    applyForce(forceDistance: number[], force: number[]) {

        //let centerDistance = Math.sqrt(forceDistance[0]**2 + forceDistance[1]**2)
        let centerAngle = Math.atan(forceDistance[0]/forceDistance[1])
        //let forceMagnitude = Math.sqrt(force[0]**2 + force[1]**2)
        //let forceAngle = Math.atan(force[1]/force[0])

        //I'm gonna rotate everthing so that center distance is a vertical line, 
        //and then I can break force into it's x and y components.
        //doing this using rotation matrix:
        // [cos, -sin]
        // [sin, cos]
        let rotatedForce = rotateVector(centerAngle, force)
        let linearForce = rotatedForce[0]
        let rotationForce = rotatedForce[1]
        //the x components become linear acceleration 
        //and the y components are rotational acceleration
        return [linearForce, rotationForce]
    }



}