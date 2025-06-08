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
    shape: Shape
    dynamic: boolean
    gravityTrue: boolean
    computer: PhysicsComputer
    coords: Vector
    rotation: Matrix

    /**
 * Represents a physical object in the simulation, which can be controlled by players or affected by physics forces.
 *
 * @remarks
 * This class manages the state and behavior of a physics object, including its shape, mass, drag, control status, and physics calculations.
 * It supports both player-controlled and dynamic objects, and can be affected by gravity.
 *
 * @param shape - The geometric shape of the physics object. Defaults to a {@link Circle} with radius 50 if not provided.
 * @param computer - The {@link PhysicsComputer} instance used for physics calculations and state management.
 * @param playerControlled1 - Whether the first player controls this object.
 * @param playerControlled2 - Whether the second player controls this object.
 * @param dynamic - Whether the object is dynamic (affected by forces).
 * @param gravityTrue - Whether the object is affected by gravity.
 */

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
        let adjustment = shape.centroidCalc()
        this.coords = computer.coords
        this.coords.values[0] += adjustment[0]
        this.coords.values[1] += adjustment[1]
    }
    
    updateForces() {

        this.shape.coords = this.coords
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
            }
        }
        if (this.playerControlled2) {
            let playerForce = .5
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
            }
        }
        if (this.gravityTrue) {
            this.computer.force = this.computer.force.add(new Vector([0,-gravity*this.mass/5, 0]) )  
        }
            
    }
    update(frames: number) {
        this.shape.update()
        let border = 0
        let safetyDistance = 0.1
        if (this.shape.AABB.ymax > canvas.height-border) {
            this.computer.momentum.values[1] = -Math.abs(this.computer.momentum.values[1])*.99
            this.computer.coords.values[1] -= this.shape.AABB.ymax - canvas.height+border + safetyDistance
            
        }
        if (this.shape.AABB.ymin < border) {
            this.computer.momentum.values[1] = Math.abs(this.computer.momentum.values[1])*.99
            this.computer.coords.values[1] -= this.shape.AABB.ymin - border - safetyDistance
            
        }
        if (this.shape.AABB.xmax > canvas.width-border) {
            this.computer.momentum.values[0] = -Math.abs(this.computer.momentum.values[0])*.99
            this.computer.coords.values[0] -= this.shape.AABB.xmax - canvas.width+border + safetyDistance
            
        }
        if (this.shape.AABB.xmin < border) {
            this.computer.momentum.values[0] = Math.abs(this.computer.momentum.values[0])*.99
            this.computer.coords.values[0] -= this.shape.AABB.xmin - border - safetyDistance
            
        }
        let y0 = this.computer.stateVectorsToArray()
        let y1 = this.computer.ode(y0, this.computer.stateVectorLength,0,1)
        this.computer.arrayToStateVectors(y1)
        this.coords = this.computer.coords
        if ( this.computer instanceof Rigidbody && this.shape instanceof Polygon) {
            this.shape.rotation = Math.atan2(this.computer.rotation.values[1][0],this.computer.rotation.values[0][0])
        }
        this.computer.reset()
    }
    
    draw() {
        this.shape.draw()
        // this.shape.drawBoundingBox()
    }
    
}