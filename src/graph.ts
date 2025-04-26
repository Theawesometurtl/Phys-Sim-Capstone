import { Matrix, Vector } from "ts-matrix";
import { canvas2, ctx2 } from "./DEMain";


export class Graph {
    constructor() {

    }
    drawAxes() {
        ctx2.lineWidth = 5
        ctx2.strokeStyle = "black"
        ctx2.moveTo(canvas2.width/2, 0)
        ctx2.lineTo(canvas2.width/2, canvas2.height)
        ctx2.moveTo(0, canvas2.height/2)
        ctx2.lineTo(canvas2.width, canvas2.height/2)
        ctx2.stroke()
    }
    draw() {
        ctx2.clearRect(0, 0, canvas2.height, canvas2.width)
        this.drawAxes()
        this.drawArrow(100, 100, 0)
    }
    plotPoint(x: number, y: number) {
        ctx2.fillStyle = "white"
        ctx2.fillRect(x, y, 10, 10)
    }
    drawLine(point1: number[], point2: number[]) {
        ctx2.lineWidth = 5
        ctx2.strokeStyle = "black"
        ctx2.moveTo(point1[0], point1[1])
        ctx2.lineTo(point2[0], point2[1])
        ctx2.stroke()
    }
    drawArrow(x: number, y: number, rotation: number, xscalar: number = 1, yscalar: number = 1) {

        let rotMatrix = new Matrix(2, 2, [[Math.cos(rotation), Math.sin(rotation)], [-Math.sin(rotation), Math.cos(rotation)]])
        let scaleMatrix = new Matrix(2, 2, [[xscalar, 0], [0, yscalar]])
        let compositionMatrix = rotMatrix.multiply(scaleMatrix)
        let arrow = new Matrix(2, 7,[[0, 0], [-5, -5], [5, -5], [2, -5], [2, -15], [-2, -15], [-2, -5]])
        let finalArrow = compositionMatrix.multiply(arrow).values
        ctx2.beginPath()
        ctx2.moveTo(x, y)
        for (let i = 0; i < arrow.values.length; i++) {
            ctx2.lineTo(x + finalArrow[i][0], y + finalArrow[i][1])
        }
        ctx2.stroke()
    }
    slopeField() {
        
    }
}