import { canvas, ctx} from "../globals"

export class Shape {
    // coords: number[]
    momentOfInertia: number
    AABB: {xmin: number, xmax:number,ymin:number,ymax:number}
    coords: number[]

    constructor() {
        this.momentOfInertia = 1
        this.AABB = {xmin: 1, xmax:1, ymin:1, ymax:1}
        this.coords = [0, 0]
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
    draw(collision: boolean) {

    }
}