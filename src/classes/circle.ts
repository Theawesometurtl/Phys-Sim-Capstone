import { canvas, ctx} from "../globals"
import { Shape } from "./Shape"
export class Circle extends Shape {
    // coords: number[]
    radius: number
    collision: boolean

    constructor(radius: number) {
        super()
        this.radius = radius
        this.momentOfInertia = this.momentOfInertiaCalc()
        this.AABB = this.getAABB()
        this.collision = false
    }
    isPointWithinCircle(point: number[]): boolean {
        let coordArray = this.coords.values
        let displacementFromCenter = Math.sqrt(Math.abs(point[0]- coordArray[0]) + Math.abs(point[1] - coordArray[1]))
        return displacementFromCenter <= this.radius
    }
    update() {
        this.AABB = this.getAABB()
    }

    getAABB() {
        let coordArray = this.coords.values

        let xmax = coordArray[0] + this.radius
        let xmin = coordArray[0] - this.radius
        let ymax = coordArray[1] + this.radius
        let ymin = coordArray[1] - this.radius
        
        this.AABB = {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
        return {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
    }
    momentOfInertiaCalc(): number { 
        return (Math.PI*(this.radius**4))/4
    }

    draw(collision: boolean) {
        let coordArray = this.coords.values

        ctx.lineWidth = 2

        ctx.beginPath();
        ctx.arc(coordArray[0], coordArray[1], this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "blue"
        if (collision) {
            ctx.fillStyle = "red"
        }
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.fillRect(coordArray[0], coordArray[1], 1, 1)
        collision = false
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