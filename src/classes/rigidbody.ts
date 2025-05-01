import { Vector } from "ts-matrix"
import { canvas, ctx, elasticity, gravity, pressedKeys} from "../globals"
import { PhysicsComputer } from "./PhysicsComputer"
export class Rigidbody extends PhysicsComputer {
    velocity: Vector
    rvelocity: number
    rotation: number
    mass: number
    linDrag: number
    coords: Vector
    momentum: Vector

    constructor(coords: number[]
     ) {
        super()
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



    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
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