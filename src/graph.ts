import { Matrix, Vector } from "ts-matrix";


export class Graph {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas
        this.ctx = ctx
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width)
    }
    drawAxes() {
        this.ctx.lineWidth = 5
        this.ctx.strokeStyle = "black"
        this.ctx.moveTo(this.canvas.width/2, 0)
        this.ctx.lineTo(this.canvas.width/2, this.canvas.height)
        this.ctx.moveTo(0, this.canvas.height/2)
        this.ctx.lineTo(this.canvas.width, this.canvas.height/2)
        this.ctx.stroke()
    }
    drawDifferential(callback: (x: number, y: number) => number[]) {
        this.drawAxes()
        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let rows = 10
        let columns = 10
        let rowSpacing = this.canvas.width/rows
        let columnSpacing = this.canvas.width/columns

        for (let i=0; i< rows; i++) {
            for (let j=0; j< columns; j++) {
                let dxdy = callback(i*-1 + this.canvas.width/2,j*-1 + this.canvas.height/2)
                //normalize dxdy
                let dxdyMagnitude = Math.sqrt(dxdy[0]**2+dxdy[1]**2)
                dxdy = [dxdy[0]/dxdyMagnitude, dxdy[1]/dxdyMagnitude]
                this.drawArrow(rowSpacing*i + rowSpacing/2, columnSpacing*j + columnSpacing/2, new Matrix(2,2,[[dxdy[0],0],[dxdy[1],0]]))
            }
        }
    }
    drawEquation(callback: (x: number[]) => number[], colour: string = "red") {

        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let resolution = 100
        let ySpacing = 100
        let rowSpacing = this.canvas.width/resolution

        this.ctx.lineWidth = 3
        this.ctx.fillStyle = colour
        this.ctx.strokeStyle = colour
        this.ctx.beginPath() 
        this.ctx.moveTo(-resolution/2, callback([-resolution/2])[0])
        for (let i=-resolution/2; i< resolution/2; i++) {
            let y = callback([i])[0]*-1
            this.ctx.lineTo((i + resolution/2)*rowSpacing, y + this.canvas.height/2)
        }
        this.ctx.stroke()
        
    }
    drawODE(ode: (y0: number[], len: number, t0: number, t1: number, dydtFunc: (x: number[]) => number[] ) => number[] , dydtFunc: (x: number[]) => number[],  colour: string = "red") {

        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let resolution = 100
        let ySpacing = 100
        let rowSpacing = this.canvas.width/resolution

        this.ctx.lineWidth = 3
        this.ctx.fillStyle = colour
        this.ctx.strokeStyle = colour
        this.ctx.beginPath() 
        this.ctx.moveTo(this.canvas.width/2, this.canvas.height/2)
        let y: number = 0
        for (let i=0; i< resolution/2; i++) {
            y -= ode([i],1,0,1,dydtFunc)[0]
            this.ctx.lineTo((i + resolution/2)*rowSpacing, y + this.canvas.height/2)
            console.log(y)
        }
        y = 0
        this.ctx.moveTo(this.canvas.width/2, this.canvas.height/2)
        for (let i=0; i> -resolution/2; i--) {
            y += ode([i],1,0,1,dydtFunc)[0]
            this.ctx.lineTo((i + resolution/2)*rowSpacing, y + this.canvas.height/2)
            console.log(y)
        }
        this.ctx.stroke()
        
    }
    plotPoint(x: number, y: number) {
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(x, y, 10, 10)
    }
    drawLine(point1: number[], point2: number[]) {
        this.ctx.lineWidth = 5
        this.ctx.strokeStyle = "black"
        this.ctx.moveTo(point1[0], point1[1])
        this.ctx.lineTo(point2[0], point2[1])
        this.ctx.stroke()
    }
    rotationAndScalarsToMatrix(rotation: number, xscalar: number = 1, yscalar: number = 1) {
        let rotMatrix = new Matrix(2, 2, [[Math.cos(rotation), Math.sin(rotation)], [-Math.sin(rotation), Math.cos(rotation)]])
        let scaleMatrix = new Matrix(2, 2, [[xscalar, 0], [0, yscalar]])
        return rotMatrix.multiply(scaleMatrix)

    }

    drawArrow(x: number, y: number, compositionMatrix: Matrix) {
        let arrow = new Matrix(2, 8,[[0, -5, 5, 1, 1, -1, -1, 5], [15, 10, 10, 10,0, 0, 10, 10]])
        let finalArrow = compositionMatrix.multiply(arrow).values
        this.ctx.strokeStyle = "red"
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(x + finalArrow[0][0], y + finalArrow[1][0])
        for (let i = 0; i < arrow.values[0].length; i++) {
            this.ctx.lineTo(x + finalArrow[0][i], y + finalArrow[1][i])
        }
        this.ctx.closePath()
        this.ctx.fillStyle = "red"
        this.ctx.stroke()
        this.ctx.fill()

    }
    slopeField() {
        
    }
}