import { canvas, ctx} from "../globals"
import { Shape } from "./Shape"
export class Circle extends Shape {
    // coords: number[]
    radius: number

    constructor() {
        super()
        this.momentOfInertia = this.momentOfInertiaCalc()
        this.AABB = this.getAABB()
        this.radius = 50
    }
    isPointWithinCircle(point: number[]): boolean {
        let displacementFromCenter = Math.sqrt(Math.abs(point[0]- this.coords[0]) + Math.abs(point[1] - this.coords[1]))
        return displacementFromCenter <= this.radius
    }
    update() {
        this.getAABB()
    }

    getAABB() {
        let xmax = this.coords[0] + this.radius
        let xmin = this.coords[0] - this.radius
        let ymax = this.coords[1] + this.radius
        let ymin = this.coords[1] - this.radius
        
        this.AABB = {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
        return {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
    }
    momentOfInertiaCalc(): number { 
        return 5
    }

    draw(collision: boolean) {
        ctx.lineWidth = 2

        ctx.beginPath();
        ctx.arc(this.coords[0], this.coords[1], this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "blue"
        if (collision) {
            ctx.fillStyle = "red"
        }
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.fillRect(this.coords[0], this.coords[1], 1, 1)
        
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
}