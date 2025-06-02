import { Matrix, Vector } from "ts-matrix"
import { Circle } from "./circle"
import { canvas, ctx, elasticity, gravity, pressedKeys } from "../globals"

import { Shape } from "./Shape"
import { PhysicsComputer } from "./PhysicsComputer"
import { Rigidbody } from "./rigidbody"
import { Polygon } from "./polygon"
export class  PhysicsObject {
    static PhysicsObjectAmount = 0
    mass: number
    linDrag: number
    playerControlled1: boolean
    playerControlled2: boolean
    physicsObjectNumber: number
    collision: boolean
    shape: Shape
    dynamic: boolean
    gravityTrue: boolean
    computer: PhysicsComputer
    coords: Vector
    rotation: Matrix
    

    constructor(shape: Shape = new Circle(50), computer: PhysicsComputer, playerControlled1: boolean, playerControlled2: boolean, dynamic: boolean, gravityTrue: boolean
     ) {
        this.computer = computer
        this.shape = shape
        this.dynamic = dynamic
        this.rotation = new Matrix(3,3, [[0,0,0],[0,0,0],[0,0,0]])
        
        // this.rvelocity =  -1* Math.PI/100
        this.mass = 1
        this.linDrag = .999
        this.playerControlled1 = playerControlled1
        this.playerControlled2 = playerControlled2
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
        if (this.playerControlled1) {
            let playerForce = 1
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
        if (this.playerControlled2) {
            let playerForce = 1
            if (pressedKeys[38]) {
                this.computer.force = this.computer.force.add(new Vector([0, -playerForce, 0]))
            }
            if (pressedKeys[40]) {
                this.computer.force = this.computer.force.add(new Vector([0, playerForce, 0]))
            }
            if (pressedKeys[37]) {
                this.computer.force = this.computer.force.add(new Vector([-playerForce, 0, 0]))
            }
            if (pressedKeys[39]) {
                this.computer.force = this.computer.force.add(new Vector([playerForce, 0, 0]))
            }}
        if (this.gravityTrue) {
            this.computer.force = this.computer.force.add(new Vector([0,-gravity*this.mass/10, 0]) )  
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
        let y1 = this.computer.ode(y0, this.computer.stateVectorLength,0,1)
        this.computer.arrayToStateVectors(y1)
        this.coords = this.computer.coords
        if ( this.computer instanceof Rigidbody && this.shape instanceof Polygon) {
            this.shape.rotation = Math.atan2(this.computer.rotation.values[1][0],this.computer.rotation.values[0][0])
        }
    }

    draw() {
        this.shape.coords = this.coords
        this.shape.draw(this.collision)
        // this.shape.drawBoundingBox()
    }
    
}