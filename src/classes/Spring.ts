import { Matrix, Vector } from "ts-matrix";
import { PhysicsComputer } from "./PhysicsComputer";
import { PhysicsObject } from "./PhysicsObject";
import { rotationAndScalarsToMatrix } from "../VectorFunctions";

export class Spring {
    object1: PhysicsObject;
    object2: PhysicsObject;
    restLength: number;
    stiffness: number;
    springPattern: Matrix;
    numOfPoints: number;
    /**
     * Creates a new Spring object.
     * @param object1 - The first physics object.
     * @param object2 - The second physics object.
     * @param restLength - The rest length of the spring.
     * @param stiffness - The stiffness of the spring.
     */
    constructor(object1: PhysicsObject, object2: PhysicsObject, restLength: number, stiffness: number) {
        this.object1 = object1;
        this.object2 = object2;
        this.restLength = restLength;
        this.stiffness = stiffness;
        let x: number[] = []
        let y: number[] = []
        this.numOfPoints = 100;
        for (let i = 0; i < this.numOfPoints; i++) {
            x[i] = i/100
            y[i] = this.springPatternCallback(i)
        }
        
        this.springPattern =  new Matrix(2, 100,[x, y])
        
    }
    update(): void {
        // Calculate the vector between the two objects
        const delta = this.object2.coords.subtract(this.object1.coords);
        const currentLength = delta.length();
        
        // Calculate the force exerted by the spring
        const forceMagnitude = this.stiffness * (currentLength - this.restLength);
        const force = delta.normalize().scale(forceMagnitude);
        
        // Apply the force to both objects
        if (this.object1.dynamic) {
            this.object1.computer.force = this.object1.computer.force.add(force);

        }
        if (this.object2.dynamic) {
            this.object2.computer.force = this.object2.computer.force.subtract(force);
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        
        let deltaPosition = this.object2.coords.subtract(this.object1.coords);
        let compositionMatrix = rotationAndScalarsToMatrix(Math.atan2(deltaPosition.values[0],deltaPosition.values[1]) - Math.PI/2, deltaPosition.length(), 50)
        
        let finalPattern = compositionMatrix.multiply(this.springPattern).values
        ctx.strokeStyle = "#bec3cc"
        ctx.lineWidth = 1
        ctx.moveTo(this.object1.coords.values[0] + finalPattern[0][0], this.object1.coords.values[1] + finalPattern[1][0])
        for (let i = 0; i < this.numOfPoints; i++) {
            ctx.lineTo(this.object1.coords.values[0] + finalPattern[0][i], this.object1.coords.values[1] + finalPattern[1][i])
            // console.log(x, finalPattern[i], y, finalPattern[i])
        }
        ctx.stroke()
        
    }
    springPatternCallback(x: number) : number {
        return Math.sin(x)/10;
    }


}