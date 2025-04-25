import { canvas, ctx} from "./globals"
import { Rigidbody } from "./rigidbody"
import { rotateVector } from "./rotateVector"
export class Polygon {
    // coords: number[]
    relVertices: number[][]
    momentOfInertia: number
    absoluteVerticies: number[][]
    mass: number
    AABB: {xmin: number, xmax:number,ymin:number,ymax:number}
    rigidbody: Rigidbody | null

    constructor(relVertices: number[][]) {
        this.relVertices = [...relVertices]
        this.centroidCalc()
        this.rigidbody = null
        this.momentOfInertia = this.momentOfInertiaCalc()
        this.absoluteVerticies = [...relVertices]
        this.mass = 1
        this.AABB = this.getAABB()
    }
    get rotation() {
        if (this.rigidbody === null) {
            return 0
        }
        return this.rigidbody.rotation
    }
    get coords() {
        if (this.rigidbody === null) {
            return [0, 0]
        }
        return this.rigidbody.coords
    }
    update() {
        this.getAbsoluteVertices()
        this.getAABB()
    }
    getAbsoluteVertices() {
        for (let i =0;i<this.relVertices.length; i++) {
            this.absoluteVerticies[i] = rotateVector(this.rotation, [...this.relVertices[i]]) 
        }
        
    }
    getNormalVector(point1: number[], point2: number[]) {
        // the line goes out when points are clockwise, goes in when points are counterclockwise
        let x = point2[0] - point1[0]
        let y = point2[1] - point1[1]
        //y/x = m
        //y = mx
        //y**2 + x**2 = 1

        //normalize
        let magnitude = Math.sqrt(y**2 + x**2)

        return [[-y/magnitude, x/magnitude],[0, 0]]
    }
    FindSevereContacts(staticVerticies: number[][]):Boolean[]  { 
        //this function will find the contacts of our shape, and will return a list for which vertices are contacts
        //hopefully eventually this function will also say which contact is the most extreme
        //find contacts using Seperating Axis Theorem
        let contacts = []
        for (let i=0;i<this.absoluteVerticies.length;i++) {
            contacts.push(true)
        }
        let min = Infinity
        let max = -Infinity
        for (let i=0; i< this.absoluteVerticies.length; i++) {
            min = Infinity
            max = -Infinity
            let normal = this.getNormalVector(this.absoluteVerticies[i], this.absoluteVerticies[(i+1)%this.absoluteVerticies.length])
            //perform dot product on normal
            //I'm treating the vertex's position as a position vector and crossing my fingers
            for (let j=0; j< staticVerticies.length; j++) {
            
                let thisDotProduct = normal[0][0] * staticVerticies[j][0] + normal[1][0] * staticVerticies[j][1]
                //I just realized that I don't need to divide by the projected distance to compare
                // vectors because everything is scaled by the projected distance
                //let projectedDistance = dotProduct/Math.sqrt(normal[0][0]**2 + normal[0][0]**2)
                if (thisDotProduct > max) {
                    max = thisDotProduct
                }
                if (thisDotProduct < min) {
                    min = thisDotProduct
                }
            }
            for (let j=0; j< this.absoluteVerticies.length; j++) {
                if (contacts[i]) {
                    let thatDotProduct = normal[0][0] * this.absoluteVerticies[j][0] + normal[1][0] * this.absoluteVerticies[j][1]
                    //let projectedDistance = dotProduct/Math.sqrt(normal[0][0]**2 + normal[0][0]**2)
                    if (thatDotProduct < min || thatDotProduct > max){
                        contacts[i] = false
                    }
                }
            }
        }
        //find most severe contact in theory idk how so I don't care
        //resolve contact
        return contacts
    }
    getAABB() {
        let xmax = this.coords[0]
        let xmin = this.coords[0]
        let ymax = this.coords[1]
        let ymin = this.coords[1]
        for (let i =0;i<this.relVertices.length; i++) {
            if (this.absoluteVerticies[i][0] + this.coords[0]> xmax) {
                xmax = this.absoluteVerticies[i][0] + this.coords[0]
            }
            if (this.absoluteVerticies[i][0] + this.coords[0] < xmin) {
                xmin = this.absoluteVerticies[i][0] + this.coords[0]
            }
            if (this.absoluteVerticies[i][1] + this.coords[1] > ymax) {
                ymax = this.absoluteVerticies[i][1] + this.coords[1]
            }
            if (this.absoluteVerticies[i][1] + this.coords[1] < ymin) {
                ymin = this.absoluteVerticies[i][1] + this.coords[1]
            }
        }
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
        // ctx.lineTo(this.relVertices[0][0] + this.coords[0],this.relVertices[0][1] + this.coords[1])
        // ctx.beginPath()
        // for (let i = 0;i< this.relVertices.length;i++) {
        //     ctx.lineTo(this.relVertices[i][0] + this.coords[0],this.relVertices[i][1] + this.coords[1])
        // }
        // ctx.closePath()
        // ctx.fillStyle = "red"
        // ctx.fill()
        ctx.lineWidth = 2
        ctx.moveTo(this.absoluteVerticies[0][0] + this.coords[0],this.absoluteVerticies[0][1] + this.coords[1])
        ctx.beginPath()
        for (let i = 0;i< this.absoluteVerticies.length;i++) {
            ctx.lineTo(this.absoluteVerticies[i][0] + this.coords[0],this.absoluteVerticies[i][1] + this.coords[1])
        }
        ctx.closePath()
        ctx.fillStyle = "blue"
        if (collision) {
            ctx.fillStyle = "red"
        }
        ctx.fill()
        ctx.fillStyle = "black"
        ctx.fillRect(this.coords[0], this.coords[1], 1, 1)
        ctx.fillRect(this.absoluteVerticies[0][0] + this.coords[0]-5, this.absoluteVerticies[0][1] + this.coords[1]-5, 10, 10)
        ctx.fillStyle = "red"
        ctx.fillRect(this.absoluteVerticies[1][0]  + this.coords[0]-5, this.absoluteVerticies[1][1] + this.coords[1]-5, 10, 10)
        ctx.strokeStyle = "red"
        ctx.beginPath()
        let point1 = this.absoluteVerticies[3%this.absoluteVerticies.length]
        let point2 = this.absoluteVerticies[4%this.absoluteVerticies.length]
        let normal = this.getNormalVector(point1, point2)
        let lineCenterx = (point1[0] + point2[0])/2
        let lineCentery = (point1[1] + point2[1])/2
        ctx.moveTo(normal[0][0]*50 + this.coords[0] +lineCenterx, normal[0][1]*50 + this.coords[1] +lineCentery)
        ctx.lineTo(normal[1][0]*50 + this.coords[0] +lineCenterx, normal[1][1]*50 + this.coords[1] +lineCentery)
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
}