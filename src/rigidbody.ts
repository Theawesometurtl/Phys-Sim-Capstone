import { Vector } from "ts-matrix"
import { Circle } from "./circle"
import { rigidbodyCollisionCheck } from "./collisions"
import { canvas, ctx, elasticity, gravity, pressedKeys} from "./globals"
import { Polygon } from "./polygon"
import { rotateVector } from "./rotateVector"
export class Rigidbody {
    velocity: Vector
    rvelocity: number
    rotation: number
    mass: number
    linDrag: number
    coords: Vector
    momentum: Vector

    constructor(coords: number[]
     ) {
        this.coords = new Vector(coords)
        this.velocity = new Vector([0,0])
        // this.rvelocity =  -1* Math.PI/100
        this.rvelocity =  0
        this.rotation = 0
        this.mass = 1
        this.linDrag = .999
        this.momentum = this.velocity.scale(this.mass)
    }
    get stateVector(){
        return [this.coords, this.rotation, this.momentum]
 }
    velocityOfPoint(relativePoint: number[]) {
        let instantaneousRotationVector = rotateVector(Math.PI/2, relativePoint)
        let vOfPoint = [-this.velocity.values[0] + instantaneousRotationVector[0] * this.rvelocity, -this.velocity.values[1]+ instantaneousRotationVector[1] *this.rvelocity]
        return vOfPoint
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

    drawForce(force: number[], coordinate: number[], magnitude: number, colour: string) {
        // ctx.lineWidth = 2
        ctx.strokeStyle = colour
        ctx.fillStyle = colour
        ctx.moveTo(coordinate[0]+2, coordinate[1]+2)
        ctx.beginPath()
        ctx.lineTo(coordinate[0], coordinate[1])
        ctx.lineTo(force[0]*magnitude + coordinate[0], force[1]*magnitude + coordinate[1])
        ctx.lineTo(force[0]*magnitude + coordinate[0]+ 2, force[1]*magnitude + coordinate[1]+2)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

    }

}