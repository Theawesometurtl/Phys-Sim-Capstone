import { Matrix, Vector } from "ts-matrix";
import { OrdinaryDifferentialEquationSolver, StateVectorDerivatives as StateVectorAndTime, StateVectorPredictor } from "../odes";



export class Graph {
    canvas: HTMLCanvasElement
    ctx: CanvasRenderingContext2D
    scale: number
    rotScale: number
    curve: number[][]
    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, scale: number = 1, rotScale: number = 1) {
        this.canvas = canvas
        this.ctx = ctx
        this.scale = scale
        this.rotScale = rotScale
        this.curve = []
    }
    continueCurve(pos: number[]) {
        this.curve.push(pos)
        if (this.curve.length> 10) {
            this.curve.shift()
        }
        this.ctx.strokeStyle = "green"
        this.ctx.moveTo(this.curve[0][0], this.curve[0][1])
        this.curve.map(([x, y]) => {
            this.ctx.lineTo(x, y)
        })

        this.ctx.stroke()
        
    }
    posToCoordinate(pos: number[]): number[] {
        return [-this.canvas.width/2 + pos[0], this.canvas.height/2 -pos[1]]
    }
    coordinateToPosition (pos: number[]): number[] {
        return [this.canvas.width/2 + pos[0], this.canvas.height/2 -pos[1]]
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.height, this.canvas.width)
    }
    drawAxes() {
        this.ctx.lineWidth = 3
        this.ctx.strokeStyle = "black"
        this.ctx.moveTo(this.canvas.width/2, 0)
        this.ctx.lineTo(this.canvas.width/2, this.canvas.height)
        this.ctx.moveTo(0, this.canvas.height/2)
        this.ctx.lineTo(this.canvas.width, this.canvas.height/2)
        this.ctx.stroke()
    }
    drawDifferential(dxdyFunc: StateVectorAndTime, colour: string | CanvasGradient | CanvasPattern = "red") {
        this.drawAxes()
        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let rows = 10
        let columns = 10
        let rowSpacing = this.canvas.width/rows
        let columnSpacing = this.canvas.height/columns


        for (let row=0; row< rows; row++) {
            for (let column=0; column< columns; column++) {
                let pos = [rowSpacing*row + rowSpacing/2, columnSpacing*column + columnSpacing/2]
                let coord = this.posToCoordinate(pos)
                let dxdy = dxdyFunc(coord[0], [coord[1]])
                //normalize dxdy
                let rotation = (Math.atan2(5, -dxdy[0]*this.rotScale))
                // console.log([row, column], [this.canvas.width, this.canvas.  height] ,pos, coord, dxdy, rotation)
                // let dxdyMagnitude = Math.sqrt(dxdy[0]**2+(row*-1)**2)
                // dxdy = [dxdy[0]*3/dxdyMagnitude, (row*-1)*3/dxdyMagnitude]
                this.drawArrow(pos[0], pos[1], this.rotationAndScalarsToMatrix(rotation), colour)
            }
        }
    }
    drawDifferentialPhysics(dxdyFunc: StateVectorAndTime, colour: string | CanvasGradient | CanvasPattern = "red") {
        this.drawAxes()
        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let rows = 10
        let columns = 10
        let rowSpacing = this.canvas.width/rows
        let columnSpacing = this.canvas.height/columns


        for (let row=0; row< rows; row++) {
            for (let column=0; column< columns; column++) {
                let pos = [rowSpacing*row + rowSpacing/2, columnSpacing*column + columnSpacing/2]
                let coord = this.posToCoordinate(pos)
                let dxdy = dxdyFunc(1, [0, coord[0],0,coord[1] ])
                //normalize dxdy
                let rotation = (Math.atan2(1, dxdy[3])*.25)
                // console.log(rotation, dxdy, coord)
                // console.log([row, column], [this.canvas.width, this.canvas.  height] ,pos, coord, dxdy, rotation)
                // let dxdyMagnitude = Math.sqrt(dxdy[0]**2+(row*-1)**2)
                // dxdy = [dxdy[0]*3/dxdyMagnitude, (row*-1)*3/dxdyMagnitude]
                this.drawArrow(pos[0], pos[1], this.rotationAndScalarsToMatrix(rotation), colour)
            }
        }
    }
    drawEquation(callback: (x: number[]) => number[], colour: string | CanvasGradient | CanvasPattern = "red") {

        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let resolution = 100
        let rowSpacing = this.canvas.width/resolution

        this.ctx.lineWidth = 3
        this.ctx.fillStyle = colour
        this.ctx.strokeStyle = colour
        this.ctx.beginPath() 
        this.ctx.moveTo(-resolution/2, callback([-resolution/2])[0]- 10)
        for (let i=0; i< this.canvas.width; i+= rowSpacing) {
            let coords = this.posToCoordinate([i, 0])
            let y = callback([coords[0]])[0]*-1
            this.ctx.lineTo(i, y + this.canvas.height/2- 10)
            // console.log(coords[0], y)
        }
        this.ctx.stroke()
        
    }
    drawODE(ode: StateVectorPredictor,  colour: string | CanvasGradient | CanvasPattern = "red") {

        // this.drawArrow(300, 300, Math.PI, .5, 1)
        let resolution = 1000
        let rowSpacing = this.canvas.width/(resolution)

        this.ctx.lineWidth = 3
        this.ctx.fillStyle = colour
        this.ctx.strokeStyle = colour
        this.ctx.beginPath() 
        this.ctx.moveTo(this.canvas.width/2, this.canvas.height/2)
        let y: number = 10
        let deltaT = this.posToCoordinate([this.canvas.width/2 + this.canvas.width/(resolution), 0])[0]
        for (let i=0; i< this.canvas.width/2; i+=deltaT) {

            y = ode([y],1,i,i+deltaT)[0]
            this.ctx.lineTo((i + this.canvas.width/2), -y + this.canvas.height/2)
            console.log(i+ deltaT, deltaT, y, ((i+ deltaT) **2)/50 + 10)
        }
        y = 10
        this.ctx.moveTo(this.canvas.width/2, this.canvas.height/2)
        for (let i=-1; i> -this.canvas.width/2; i-=deltaT) {
        y = ode([y],1,i,i-deltaT)[0]
            this.ctx.lineTo((i + this.canvas.width/2), -y + this.canvas.height/2)
            // console.log(y)
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

    drawArrow(x: number, y: number, compositionMatrix: Matrix, colour: string | CanvasGradient | CanvasPattern = "red") {
        let arrow = new Matrix(2, 8,[[0, -5, 5, 1, 1, -1, -1, 5], [15, 10, 10, 10,0, 0, 10, 10]])
        let finalArrow = compositionMatrix.multiply(arrow).values
        this.ctx.strokeStyle = "red"
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(x + finalArrow[0][0], y + finalArrow[1][0])
        for (let i = 0; i < arrow.values[0].length; i++) {
            this.ctx.lineTo(x + finalArrow[0][i], y + finalArrow[1][i])
            // console.log(x, finalArrow[i], y, finalArrow[i])
        }
        this.ctx.closePath()
        this.ctx.fillStyle = "red"
        this.ctx.stroke()
        this.ctx.fill()

    }
    slopeField() {
        
    }
}