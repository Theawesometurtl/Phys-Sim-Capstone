import { canvas, ctx, elasticity, gravity } from "./constants"
import { rotateVector } from "./rotateVector"
export class Polygon {
    coords: number[]
    relVertices: number[][]
    velocity: number[]
    momentOfInertia: number
    rvelocity: number
    rotation: number
    absoluteVerticies: number[][]

    constructor(relVertices: number[][], coords: number[], ) {
        this.relVertices = [...relVertices]
        this.coords = coords
        let centroidAdjustment = this.centroidCalc()
        this.coords[0] += centroidAdjustment[0]
        this.coords[1] += centroidAdjustment[1]
        this.velocity = [0,0]
        this.rvelocity =  1* Math.PI/100
        this.rotation = 0
        this.momentOfInertia = this.momentOfInertiaCalc()
        this.absoluteVerticies = [...relVertices]
    }
    applyForce(forceDistance: number[], force: number[]) {

        //let centerDistance = Math.sqrt(forceDistance[0]**2 + forceDistance[1]**2)
        let centerAngle = Math.atan(forceDistance[0]/forceDistance[1])
        //let forceMagnitude = Math.sqrt(force[0]**2 + force[1]**2)
        //let forceAngle = Math.atan(force[1]/force[0])

        //I'm gonna rotate everthing so that center distance is a vertical line, 
        //and then I can break force into it's x and y components.
        //doing this using rotation matrix:
        // [cos, -sin]
        // [sin, cos]
        let rotatedForce = rotateVector(centerAngle, force)
        let linearForce = rotatedForce[0]
        let rotationForce = rotatedForce[1]
        //the x components become linear acceleration 
        //and the y components are rotational acceleration
        return [linearForce, rotationForce]
    }
    momentOfInertiaCalc() {
        return 5
    }
    centroidCalc() {
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
    update() {
        this.velocity[1] -= gravity
        this.coords[0] += this.velocity[0]
        this.coords[1] += this.velocity[1]
        this.rotation += this.rvelocity
        if (this.rotation > Math.PI*2) {
            this.rotation -= Math.PI*2
        } else if (this.rotation < 0) {
            this.rotation -= Math.PI*2
        }
        for (let i =0;i<this.relVertices.length; i++) {
            this.absoluteVerticies[i] = rotateVector(this.rotation, [...this.relVertices[i]])
            if (this.absoluteVerticies[i][1] + this.coords[1] -0.5 > canvas.height) {
                this.coords[1] = canvas.height - this.absoluteVerticies[i][1]
                let linForce = this.applyForce([...this.absoluteVerticies[i]], [0,this.velocity[1]])
                let rotForce: number[] = []
                // rotForce = rotateVector(-Math.PI/2,[this.absoluteVerticies[i][0], this.absoluteVerticies[i][1]])
                
                if (this.absoluteVerticies[i][0] > 0) {
                    rotForce = this.applyForce(this.absoluteVerticies[i], [0, -this.rvelocity])
                } else {
                    rotForce = this.applyForce(this.absoluteVerticies[i], [0, this.rvelocity])
                }

                // this.drawForce(rotForce, this.absoluteVerticies[i], 0.1, "red")

                let netForce = [rotForce[0] - linForce[0], rotForce[1]*this.momentOfInertia + linForce[1]]
                console.log(this.velocity, netForce, rotForce, linForce, this.rvelocity, this.absoluteVerticies[i])
                this.velocity[1] -= 2*netForce[1]
                this.rvelocity += netForce[0]/(this.momentOfInertia)
                
            }
            if (this.absoluteVerticies[i][0] + this.coords[0] < 0) {
                this.coords[0] = 0 - this.absoluteVerticies[i][0]
                this.velocity[0] *= -elasticity
            }
            if (this.absoluteVerticies[i][0] + this.coords[0] > canvas.width) {
                this.coords[0] = canvas.width - this.absoluteVerticies[i][0]
                this.velocity[0] *= -elasticity
            }
        }
    }
    draw() {
        // ctx.lineTo(this.relVertices[0][0] + this.coords[0],this.relVertices[0][1] + this.coords[1])
        // ctx.beginPath()
        // for (let i = 0;i< this.relVertices.length;i++) {
        //     ctx.lineTo(this.relVertices[i][0] + this.coords[0],this.relVertices[i][1] + this.coords[1])
        // }
        // ctx.closePath()
        // ctx.fillStyle = "red"
        // ctx.fill()
        ctx.lineTo(this.absoluteVerticies[0][0] + this.coords[0],this.absoluteVerticies[0][1] + this.coords[1])
        ctx.beginPath()
        for (let i = 0;i< this.absoluteVerticies.length;i++) {
            ctx.lineTo(this.absoluteVerticies[i][0] + this.coords[0],this.absoluteVerticies[i][1] + this.coords[1])
        }
        ctx.closePath()
        ctx.fillStyle = "blue"
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.fillRect(this.coords[0], this.coords[1], 1, 1)
    }
    drawForce(force: number[], coordinate: number[], magnitude: number, colour: string) {
        ctx.lineWidth = 2
        ctx.strokeStyle = colour
        ctx.lineTo(coordinate[0], coordinate[1])
        ctx.beginPath()
        ctx.lineTo(coordinate[0]+2, coordinate[1]+2)
        ctx.lineTo(force[0]*magnitude + coordinate[0], force[1]*magnitude + coordinate[1])
        ctx.lineTo(force[0]*magnitude + coordinate[0]+ 2, force[1]*magnitude + coordinate[1]+2)
        ctx.closePath()
        ctx.stroke()

    }
}