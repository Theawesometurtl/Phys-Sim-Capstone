import { canvas, ctx} from "./globals"
import { Rigidbody } from "./rigidbody"
import { rotateVector } from "./rotateVector"
export class Circle {
    // coords: number[]
    relVertices: number[][]
    momentOfInertia: number
    mass: number
    AABB: {xmin: number, xmax:number,ymin:number,ymax:number}
    rigidbody: Rigidbody
    radius: number

    constructor(relVertices: number[][], rigidbody: Rigidbody) {
        this.relVertices = [...relVertices]
        this.rigidbody = rigidbody
        this.momentOfInertia = this.momentOfInertiaCalc()
        this.mass = 1
        this.AABB = this.getAABB()
        this.radius = 5
    }
    update() {

    }

    getAABB() {
        let xmax = this.rigidbody.coords[0] + this.radius
        let xmin = this.rigidbody.coords[0] - this.radius
        let ymax = this.rigidbody.coords[1] + this.radius
        let ymin = this.rigidbody.coords[1] - this.radius
        
        this.AABB = {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
        return {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
    }
    momentOfInertiaCalc(): number { 
        return 5
    }
    centroidCalc(): number[] {
        let x: number = 0
        let y: number = 0
        for (let i =0;i<this.relVertices.length; i++) {
            x+=this.relVertices[i][0]
            y+=this.relVertices[i][1]
        }
        x = x/this.relVertices.length
        y = y/this.relVertices.length
        for (let i =0;i<this.relVertices.length; i++) {
            this.relVertices[i][0] -= x
            this.relVertices[i][1] -= y
        }
        return [x,y]
        
    }
    draw(collision: boolean) {
        console.log(this.rigidbody.coords)
        ctx.beginPath();
        ctx.arc(this.rigidbody.coords[0], this.rigidbody.coords[1], this.radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "blue"
        if (collision) {
            ctx.fillStyle = "red"
        }
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.fillRect(this.rigidbody.coords[0], this.rigidbody.coords[1], 1, 1)
        
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