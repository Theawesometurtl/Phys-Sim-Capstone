import { Matrix, Vector } from "ts-matrix"
import { ctx} from "../globals"
import { PhysicsComputer } from "./PhysicsComputer"
import { IncrementingValue } from "./Counter"
export class Rigidbody extends PhysicsComputer {
    velocity: Vector
    rvelocity: number
    rotation: Matrix
    mass: number
    linDrag: number
    momentum: Vector
    angularMomentum: Vector
    invMass: number
    torque: Vector
    force: Vector

    /**
     * 
     * @param coords - The coordinates of the rigid body in 3D space.
     */
    constructor(coords: Vector) {
        super(coords)
        
        this.velocity = new Vector([0,0, 0])
        // this.rvelocity =  -1* Math.PI/100
        this.rvelocity =  0
        this.rotation = new Matrix(3,3, [[0,0,0],[0,0,0],[0,0,0]])
        this.mass = 1
        this.invMass = this.mass**-1
        this.linDrag = .999
        this.momentum = new Vector([0,0, 0])
        this.angularMomentum = new Vector([0,0,1])
        this.torque = new Vector([0,0,0])
        this.force = new Vector([0,0, 0])
        this.stateVectorLength = 18

    }
    stateVectorsToArray(): number[]{
        return [...this.coords.values, ...this.momentum.values, ...this.angularMomentum.values, ...this.rotation.values[0],...this.rotation.values[1],...this.rotation.values[2] ]
    }

    arrayToStateVectors(array: number[]): void {
        let i = new IncrementingValue()
        this.coords = new Vector([array[i.value], array[i.value], array[i.value]])
        this.momentum = new Vector([array[i.value], array[i.value], array[i.value]])
        this.angularMomentum = new Vector([array[i.value], array[i.value], array[i.value]])
        this.rotation = new Matrix(3,3,[[array[i.value], array[i.value], array[i.value],array[i.value], array[i.value], array[i.value],array[i.value], array[i.value], array[i.value]]])
        
    }
    reset(): void {
        this.torque = new Vector([0,0,1])
        this.force = new Vector([0,0, 0])
        
    }
    dydt(t: number = 0, y0: number[]): number[] {
        let dValues: number[] = []
        let forceValues = (this.force).values
        let i = new IncrementingValue()



        dValues[i.value] = y0[3]*this.invMass
        dValues[i.value] = y0[4]*this.invMass
        dValues[i.value] = y0[5]*this.invMass
        dValues[i.value] = forceValues[0]
        dValues[i.value] = forceValues[1]
        dValues[i.value] = forceValues[2]
        dValues[i.value] = this.torque.values[0]
        dValues[i.value] = this.torque.values[1]
        dValues[i.value] = this.torque.values[2]
        let angularMomentumSkewSymetricMatrix = new Matrix(3,3, [[0, -y0[8], y0[7],],
                                                                [y0[8],0,-y0[6]], 
                                                                [-y0[7], y0[6],0]])
        let j = new IncrementingValue(8)
        
        let rotationMatrix = new Matrix(3,3, [[y0[j.value],y0[j.value],y0[j.value]],
                                                [y0[j.value],y0[j.value],y0[j.value]],
                                                [y0[j.value],y0[j.value],y0[j.value]]])
        let ddtRotationMatrix = angularMomentumSkewSymetricMatrix.multiply(rotationMatrix)
        for (let k = 0; k < ddtRotationMatrix.values.length; k++) {
            ddtRotationMatrix.values[k].map((value: number) => dValues[i.value] = value)
        }
        

        return dValues
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