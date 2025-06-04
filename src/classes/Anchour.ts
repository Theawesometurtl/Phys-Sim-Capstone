import { Vector } from "ts-matrix";
import { PhysicsObject } from "./PhysicsObject";
import { Shape } from "./Shape";
import { ctx } from "../globals";

export class Anchour extends Shape {
    position: Vector;
    /** * Creates an instance of Anchour.
     * @param {Vector} position - The position of the anchor in 2D space.
     */
    constructor(position: Vector) {
        super();
        this.position = position;
    }
    draw(): void {
        // Draw the anchor as a small circle
        ctx.lineWidth = 2;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.position.values[0], this.position.values[1]);
        ctx.lineTo(this.position.values[0] + 5, this.position.values[1]+5);
        ctx.lineTo(this.position.values[0] - 5, this.position.values[1]+5);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
    }




}