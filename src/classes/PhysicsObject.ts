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
        let adjustment = shape.centroidCalc()
        this.coords.values[0] += adjustment[0]
        this.coords.values[1] += adjustment[1]
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
        
        
        
        this.shape.update()
        this.computer.force = new Vector([0,-gravity*this.mass*1000])
        let y0 = this.computer.stateVectorsToArray()
        let y1 = this.computer.ode(y0, 4,0,1)
        this.computer.arrayToStateVectors(y1)
        this.coords = this.computer.coords
            
    }

    draw() {
        this.shape.coords = this.coords
        this.shape.draw(this.collision)
        this.shape.drawBoundingBox()
    }
    
}