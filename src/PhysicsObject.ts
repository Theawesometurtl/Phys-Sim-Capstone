import { Vector } from "ts-matrix"
import { Circle } from "./circle"
import { rigidbodyCollisionCheck } from "./collisions"
import { canvas, ctx, elasticity, gravity, pressedKeys } from "./globals"
import { Polygon } from "./polygon"
import { rotateVector } from "./rotateVector"
import { Shape } from "./shape"
import { PhysicsComputer } from "./PhysicsComputer"
export class  PhysicsObject {
    static PhysicsObjectAmount = 0
    velocity: Vector
    mass: number
    linDrag: number
    playerControlled: boolean
    physicsObjectNumber: number
    collision: boolean
    shape: Shape
    coords: Vector
    dynamic: boolean
    gravityTrue: boolean
    momentum: Vector
    computer: PhysicsComputer

    constructor(shape: Shape = new Circle(), computer: PhysicsComputer, playerControlled: boolean, dynamic: boolean, gravityTrue: boolean
     ) {
        this.computer = computer
        this.coords = computer.coords
        this.shape = shape
        this.dynamic = dynamic
        this.velocity = new Vector([0,0])
        // this.rvelocity =  -1* Math.PI/100
        this.mass = 1
        this.linDrag = .999
        this.playerControlled = playerControlled
        this.physicsObjectNumber = PhysicsObject.PhysicsObjectAmount
        this.gravityTrue = gravityTrue
        PhysicsObject.PhysicsObjectAmount ++;
        this.collision = false
        this.momentum = this.velocity.scale(this.mass)
    }
    get stateVector(){
        return [this.coords, this.momentum]
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
    update(frames: number) {
        this.collision = false
        if (this.playerControlled) {
            if (pressedKeys[87]) {
                this.coords.values[1] -= 4
            }
            if (pressedKeys[83]) {
                this.coords.values[1] += 4
            }
            if (pressedKeys[65]) {
                this.coords.values[0] -= 4
            }
            if (pressedKeys[68]) {
                this.coords.values[0] += 4
            }}
        if (this.gravityTrue)
            {this.velocity.values[1] -= gravity *2}
        this.coords.add(this.velocity.scale(frames))
        this.velocity.scale(this.linDrag)


        
        this.shape.update()
        
        // console.log(this.shape.AABB)




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
    draw() {
        this.shape.draw(this.collision)
        this.shape.drawBoundingBox()
    }
    
}