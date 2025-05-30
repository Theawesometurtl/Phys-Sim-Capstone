import { Vector } from "ts-matrix"
import { Circle } from "./circle"
import { canvas, ctx, elasticity, gravity, pressedKeys } from "../globals"

import { Shape } from "./Shape"
import { PhysicsComputer } from "./PhysicsComputer"
export class  PhysicsObject {
    static PhysicsObjectAmount = 0
    mass: number
    linDrag: number
    playerControlled: boolean
    physicsObjectNumber: number
    collision: boolean
    shape: Shape
    dynamic: boolean
    gravityTrue: boolean
    computer: PhysicsComputer
    coords: Vector
    

    constructor(shape: Shape = new Circle(50), computer: PhysicsComputer, playerControlled: boolean, dynamic: boolean, gravityTrue: boolean
     ) {
        this.computer = computer
        this.shape = shape
        this.dynamic = dynamic
        // this.rvelocity =  -1* Math.PI/100
        this.mass = 1
        this.linDrag = .999
        this.playerControlled = playerControlled
        this.physicsObjectNumber = PhysicsObject.PhysicsObjectAmount
        this.gravityTrue = gravityTrue
        PhysicsObject.PhysicsObjectAmount ++;
        this.collision = false
        let adjustment = shape.centroidCalc()
        this.coords = computer.coords
        this.coords.values[0] += adjustment[0]
        this.coords.values[1] += adjustment[1]
    }
    
    
    update(frames: number) {
        this.computer.reset()
        this.collision = false
        if (this.playerControlled) {
            let playerForce = 10
            if (pressedKeys[87]) {
                this.computer.force = this.computer.force.add(new Vector([0, -playerForce, 0]))
            }
            if (pressedKeys[83]) {
                this.computer.force = this.computer.force.add(new Vector([0, playerForce, 0]))
            }
            if (pressedKeys[65]) {
                this.computer.force = this.computer.force.add(new Vector([-playerForce, 0, 0]))
            }
            if (pressedKeys[68]) {
                this.computer.force = this.computer.force.add(new Vector([playerForce, 0, 0]))
            }}
        if (this.gravityTrue) {
            this.computer.force = this.computer.force.add(new Vector([0,-gravity*this.mass*1, 0]) )  
            }
        
        this.shape.update()
        if (this.shape.AABB.ymax > canvas.height) {
            this.computer.momentum.values[1] = -this.computer.momentum.values[1]*.99
            this.computer.coords.values[1] -= this.shape.AABB.ymax - canvas.height
        }
        if (this.shape.AABB.ymin < 0) {
            this.computer.momentum.values[1] = -this.computer.momentum.values[1]*.99
            this.computer.coords.values[1] -= this.shape.AABB.ymin - 0

        }
        if (this.shape.AABB.xmax > canvas.width) {
            this.computer.momentum.values[0] = -this.computer.momentum.values[0]*.99
            this.computer.coords.values[0] -= this.shape.AABB.xmax - canvas.width

        }
        if (this.shape.AABB.xmin < 0) {
            this.computer.momentum.values[0] = -this.computer.momentum.values[0]*.99
            this.computer.coords.values[0] -= this.shape.AABB.xmin - 0

        }
        let y0 = this.computer.stateVectorsToArray()
        let y1 = this.computer.ode(y0, 4,0,1)
        
        this.computer.arrayToStateVectors(y1)
        this.coords = this.computer.coords
    }

    draw() {
        this.shape.coords = this.coords
        this.shape.draw(this.collision)
        // this.shape.drawBoundingBox()
    }
    
}