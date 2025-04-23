import { ctx } from "./globals"

export class ForceArrows {
    coords: number[]
    direction: number[]
    constructor(coords: number[], direction: number[]) {
        this.coords = coords
        let magnitude = Math.sqrt(direction[0]**2 + direction[1]**2)
        this.direction = [direction[0]/magnitude, direction[1]/magnitude]

    }
    drawArrow() {
        ctx.fillStyle = "red"
        ctx.lineTo(this.coords[0], this.coords[1]+1)
        ctx.beginPath()
        ctx.lineTo(this.coords[0], this.coords[1]-1)
        ctx.lineTo(this.coords[0] + 100*this.direction[0], this.coords[1]-1 + 100*this.direction[1])
        ctx.lineTo(this.coords[0] + 100*this.direction[0], this.coords[1]+1 + 100*this.direction[1])
    }
}