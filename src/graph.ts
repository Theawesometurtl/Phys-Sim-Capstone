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
        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let rows = 10
        let columns = 10
        let rowSpacing = canvas2.width/rows
        let columnSpacing = canvas2.width/columns

        for (let i=0; i< rows; i++) {
            for (let j=0; j< columns; j++) {
                this.drawArrow(rowSpacing*i + rowSpacing/2, columnSpacing*j + columnSpacing/2,(i +j)*Math.PI/10,.5,1)
            }
        }
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
        // let arrow = new Matrix(2, 7,[[0, 0], [-50, -50], [50, -50], [20, -50], [20, -150], [-20, -150], [-20, -50]])
        let arrow = new Matrix(2, 8,[[0, -5, 5, 1, 1, -1, -1, 5], [15, 10, 10, 10,0, 0, 10, 10]])
        console.log(arrow)
        let finalArrow = compositionMatrix.multiply(arrow).values
        ctx2.strokeStyle = "red"
        ctx2.lineWidth = 1
        ctx2.beginPath()
        ctx2.moveTo(x + finalArrow[0][0], y + finalArrow[1][0])
        console.log(arrow)
        console.log(compositionMatrix)
        console.log(finalArrow)
        for (let i = 0; i < arrow.values[0].length; i++) {
            console.log("called")
            ctx2.lineTo(x + finalArrow[0][i], y + finalArrow[1][i])
        }
        ctx2.closePath()
        ctx2.fillStyle = "red"
        ctx2.stroke()
        ctx2.fill()

    }
    slopeField() {
        
    }
}