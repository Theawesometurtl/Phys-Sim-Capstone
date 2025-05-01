import { Matrix, Vector } from "ts-matrix"
import { canvas, ctx} from "../globals.ts"
import { Shape } from "./Shape.ts"
export class Polygon extends Shape {
    // coords: number[]
    relVertices: Matrix
    absoluteVerticies: Matrix
    rotation: number

    constructor(relVertices: Matrix) {
        super()
        this.relVertices = relVertices
        this.centroidCalc()
        this.momentOfInertia = this.momentOfInertiaCalc()
        this.absoluteVerticies = relVertices
        this.AABB = this.getAABB()
        this.rotation = 0
    }

    update() {
        this.getAbsoluteVertices()
        this.getAABB()
    }
    getAbsoluteVertices() {
        let rotMatrix = new Matrix(2, 2, [
            [Math.cos(this.rotation), -Math.sin(this.rotation)],
            [Math.sin(this.rotation), Math.cos(this.rotation)]])

        this.absoluteVerticies = rotMatrix.multiply(this.absoluteVerticies)
    }
    getNormalVector(point1: number[], point2: number[]): Vector {
        // the line goes out when points are clockwise, goes in when points are counterclockwise
        let x = point2[0] - point1[0]
        let y = point2[1] - point1[1]
        //y/x = m
        //y = mx
        //y**2 + x**2 = 1

        //normalize
        let magnitude = Math.sqrt(y**2 + x**2)

        return new Vector([-y/magnitude, x/magnitude])
    }

    getAABB() {
        let xmax = this.coords[0]
        let xmin = this.coords[0]
        let ymax = this.coords[1]
        let ymin = this.coords[1]
        let values = this.absoluteVerticies.values
        for (let i =0;i<this.relVertices.columns; i++) {
            if (values[i][0] + this.coords[0]> xmax) {
                xmax = values[i][0] + this.coords[0]
            }
            if (values[i][0] + this.coords[0] < xmin) {
                xmin = values[i][0] + this.coords[0]
            }
            if (values[i][1] + this.coords[1] > ymax) {
                ymax = values[i][1] + this.coords[1]
            }
            if (values[i][1] + this.coords[1] < ymin) {
                ymin = values[i][1] + this.coords[1]
            }
        }
        this.AABB = {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
        return {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
    }
    momentOfInertiaCalc(): number { 
        return 5
    }
    centroidCalc(): number[] {
        let x: number = 0
        let y: number = 0
        let relValues = this.relVertices.values
        for (let i =0;i<this.relVertices.columns; i++) {
            x+=relValues[i][0]
            y+=relValues[i][1]
        }
        x = x/this.relVertices.columns
        y = y/this.relVertices.columns
        for (let i =0;i<this.relVertices.columns; i++) {
            relValues[i][0] -= x
            relValues[i][1] -= y
        }
        return [x,y]
        
    }
    draw(collision: boolean) {

        
        ctx.lineWidth = 2
        ctx.moveTo(this.absoluteVerticies.values[0][0] + this.coords[0],this.absoluteVerticies.values[0][1] + this.coords[1])
        ctx.beginPath()
        for (let i = 0;i< this.absoluteVerticies.columns;i++) {
            ctx.lineTo(this.absoluteVerticies.values[i][0] + this.coords[0],this.absoluteVerticies.values[i][1] + this.coords[1])
        }
        ctx.closePath()
        ctx.fillStyle = "blue"
        if (collision) {
            ctx.fillStyle = "red"
        }
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.fillRect(this.coords[0], this.coords[1], 1, 1)
        ctx.fillRect(this.absoluteVerticies.values[0][0] + this.coords[0]-5, this.absoluteVerticies.values[0][1] + this.coords[1]-5, 10, 10)
        ctx.fillStyle = "red"
        ctx.fillRect(this.absoluteVerticies.values[1][0]  + this.coords[0]-5, this.absoluteVerticies.values[1][1] + this.coords[1]-5, 10, 10)
        ctx.strokeStyle = "red"
        ctx.beginPath()
        let point1 = this.absoluteVerticies.values[3%this.absoluteVerticies.columns]
        let point2 = this.absoluteVerticies.values[4%this.absoluteVerticies.columns]
        let normal = this.getNormalVector(point1, point2).values
        let lineCenterx = (point1[0] + point2[0])/2
        let lineCentery = (point1[1] + point2[1])/2
        ctx.moveTo(normal[0]*50 + this.coords[0] +lineCenterx, normal[1]*50 + this.coords[1] +lineCentery)
        ctx.lineTo(this.coords[0] +lineCenterx, this.coords[1] +lineCentery)
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
}