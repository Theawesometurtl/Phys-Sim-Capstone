import { Matrix, Vector } from "ts-matrix";
import { canvas, ctx } from "./globals";


export class graph {
    constructor() {

    }
    drawAxes() {
        ctx.lineWidth = 5
        ctx.strokeStyle = "black"
        ctx.moveTo(canvas.width/2, 0)
        ctx.lineTo(canvas.width/2, canvas.height)
        ctx.moveTo(0, canvas.height/2)
        ctx.lineTo(canvas.width, canvas.height/2)
        ctx.stroke()
    }
    draw() {
        ctx.clearRect(0, 0, canvas.height, canvas.width)
        this.drawAxes()
    }
    plotPoint(x: number, y: number) {
        ctx.fillStyle = "white"
        ctx.fillRect(x, y, 10, 10)
    }
    drawLine(point1: number[], point2: number[]) {
        ctx.lineWidth = 5
        ctx.strokeStyle = "black"
        ctx.moveTo(point1[0], point1[1])
        ctx.lineTo(point2[0], point2[1])
        ctx.stroke()
    }
    drawArrow(x: number, y: number, matrix: Matrix) {
        let arrow = new Matrix(2, 7,[[0, 0], [-5, -5], [5, -5], [2, -5], [2, -15], [-2, -15], [-2, -5]])
        matrix.multiply(arrow)
        
    }
    slopeField() {
        
    }
}