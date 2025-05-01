import { Vector } from "ts-matrix"
import { Circle } from "./circle"
import { canvas, ctx, elasticity, gravity, pressedKeys } from "../globals"

import { Shape } from "./Shape"
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