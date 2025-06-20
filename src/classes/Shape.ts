import { Matrix, Vector } from "ts-matrix"
import { canvas, ctx} from "../globals"

export class Shape {
    // coords: number[]
    momentOfInertia: number
    AABB: {xmin: number, xmax:number,ymin:number,ymax:number}
    coords: Vector
    collision: boolean

    /**
     * Creates a new Shape object.
     * The shape is defined by its moment of inertia, axis-aligned bounding box (AABB), coordinates, and collision status.
     */

    constructor() {
        this.momentOfInertia = 1
        this.AABB = {xmin: 1, xmax:1, ymin:1, ymax:1}
        this.coords = new Vector([0, 0])
        this.collision = false
    }


    drawBoundingBox() {
        ctx.strokeStyle = "red"
        ctx.lineWidth = 5

        ctx.beginPath()
        ctx.moveTo(this.AABB.xmin, this.AABB.ymin)
        ctx.lineTo(this.AABB.xmin, this.AABB.ymax)
        ctx.lineTo(this.AABB.xmax, this.AABB.ymax)
        ctx.lineTo(this.AABB.xmax, this.AABB.ymin)
        ctx.lineTo(this.AABB.xmin, this.AABB.ymin)
        ctx.stroke()
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
    update() {

    }
    draw() {

    }

    drawArrow(x: number, y: number, compositionMatrix: Matrix, colour: string | CanvasGradient | CanvasPattern = "pink") {
        let arrow = new Matrix(2, 8,[[0, -5, 5, 1, 1, -1, -1, 5], [15, 10, 10, 10,0, 0, 10, 10]])
        let finalArrow = compositionMatrix.multiply(arrow).values
        ctx.strokeStyle = colour
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x + finalArrow[0][0], y + finalArrow[1][0])
        for (let i = 0; i < arrow.values[0].length; i++) {
            ctx.lineTo(x + finalArrow[0][i], y + finalArrow[1][i])
            // console.log(x, finalArrow[i], y, finalArrow[i])
        }
        ctx.closePath()
        ctx.fillStyle = colour
        ctx.stroke()
        ctx.fill()
        return [x + finalArrow[0][0], y + finalArrow[1][0]]
    
    }
    centroidCalc() {
        return [0,0]
    }
}