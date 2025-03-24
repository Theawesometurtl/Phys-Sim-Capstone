import { canvas, ctx, elasticity, gravity, pressedKeys, rigidbodyCoords } from "./constants"
import { rotateVector } from "./rotateVector"
export class Polygon {
    coords: number[]
    relVertices: number[][]
    velocity: number[]
    momentOfInertia: number
    rvelocity: number
    rotation: number
    absoluteVerticies: number[][]
    mass: number
    playerControlled: boolean
    static polygonAmount = 0
    polygonNumber: number

    constructor(relVertices: number[][], coords: number[], playerControlled: boolean ) {
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
        this.mass = 1
        this.playerControlled = playerControlled
        this.polygonNumber = Polygon.polygonAmount
        Polygon.polygonAmount ++;
        rigidbodyCoords[this.polygonNumber] = []
    }
    
    getNormalVector(point1: number[], point2: number[]) {
        // the line goes out when points are clockwise, goes in when points are counterclockwise
        let x = point2[0] - point1[0]
        let y = point2[1] - point1[1]
        //y/x = m
        //y = mx
        //y**2 + x**2 = 1
        return [[-y, x],[y, -x]]
    }
    resolveContactStatic(staticVerticies: number[][]) {
        //find contacts using Seperating Axis Theorem
        let contacts = []
        for (let i=0;i<staticVerticies.length;i++) {
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
            for (let i=0; i< this.absoluteVerticies.length; i++) {
            
                let thisDotProduct = normal[0][0] * staticVerticies[i][0] + normal[1][0] * staticVerticies[i][1]
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
            for (let i=0; i< staticVerticies.length; i++) {
                if (contacts[i]) {
                    let thatDotProduct = normal[0][0] * staticVerticies[i][0] + normal[1][0] * staticVerticies[i][1]
                    //let projectedDistance = dotProduct/Math.sqrt(normal[0][0]**2 + normal[0][0]**2)
                    if (thatDotProduct < min || thatDotProduct > max){
                        contacts[i] = false
                    }
                }
            }
        }
        //find most severe contact in theory idk how so I don't care
        //resolve contact
        for (let i=0; i< staticVerticies.length; i++) {
            if (!contacts[i]) {

            }
        }
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
        return {xmin: xmin, xmax:xmax,ymin:ymin,ymax:ymax}
    }
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   
    energyCalc() {
        let kineticEnergy  = Math.abs((1/2)* this.momentOfInertia*this.rvelocity**2) + (1/4) * this.mass * Math.sqrt(this.velocity[0]**2 + this.velocity[1]**2)**2
        let potentialEnergy = Math.abs((this.coords[1] - canvas.height) * gravity)  * this.mass 
        let netEnergy = kineticEnergy + potentialEnergy
        let text = "PotE: " + Math.floor(potentialEnergy)
        let text1 = "KinE: " + Math.floor(kineticEnergy)
        let text2 = "Energy: " + Math.floor(netEnergy)
        ctx.fillStyle = "white"
        ctx.font = "40px Verdana"
        
        ctx.fillText(text, 300, 50, 1000)
        ctx.fillText(text1, 300, 100, 1000)
        ctx.fillText(text2, 300, 150, 1000)
        return netEnergy
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
    update(frames: number) {
        if (this.playerControlled) {
        if (pressedKeys[87]) {
            this.coords[1] -= 2
        }
        if (pressedKeys[83]) {
            this.coords[1] += 2
        }
        if (pressedKeys[65]) {
            this.coords[0] -= 2
        }
        if (pressedKeys[68]) {
            this.coords[0] += 2
        }}
        // this.velocity[1] -= gravity *2
        this.coords[0] += this.velocity[0]*frames
        this.coords[1] += this.velocity[1]*frames
        this.rotation += this.rvelocity
        if (this.rotation > Math.PI*2) {
            this.rotation -= Math.PI*2
        } else if (this.rotation < 0) {
            this.rotation -= Math.PI*2
        }
        for (let i =0;i<this.relVertices.length; i++) {
            this.absoluteVerticies[i] = rotateVector(this.rotation, [...this.relVertices[i]]) 
        }

            //bounding box 
        let AABB = this.getAABB()
        

        rigidbodyCoords[this.polygonNumber][0] = [[AABB.xmin, AABB.ymin],[AABB.ymin, AABB.ymax]]
        rigidbodyCoords[this.polygonNumber][1] = this.absoluteVerticies
        if (AABB.xmin < 0) {
            this.resolveContactStatic([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]])
            this.velocity[0] *= -elasticity
        }
        if (AABB.ymax > canvas.height) {
            
        }
        if (AABB.xmax > canvas.width) {
            
            this.velocity[0] *= -elasticity
        }
        
        for (let i =0;i<rigidbodyCoords.length; i++) {

        }
        for (let i =0;i<this.relVertices.length; i++) {
            if (this.absoluteVerticies[i][1] + this.coords[1] -0.5 > canvas.height) {
                this.coords[1] = canvas.height - this.absoluteVerticies[i][1]
                // let v1 = this.linearVelocityOfPoint(this.absoluteVerticies[i], this.velocity, this.rvelocity)
                // let v2 = [0, 0]
                // let vf = [2*(v2[0] - v1[0]), 2*(v2[1] - v1[1])]
                // vf = w*r + lin
                // let linForce = this.applyForce([...this.absoluteVerticies[i]], [0,this.velocity[1]])
                // let rotForce: number[] = []
                // // rotForce = rotateVector(-Math.PI/2,[this.absoluteVerticies[i][0], this.absoluteVerticies[i][1]])
                
                // if (this.absoluteVerticies[i][0] > 0) {
                //     rotForce = this.applyForce(this.absoluteVerticies[i], [0, -this.rvelocity])
                // } else {
                //     rotForce = this.applyForce(this.absoluteVerticies[i], [0, this.rvelocity])
                // }
                
                // // this.drawForce(rotForce, this.absoluteVerticies[i], 0.1, "red")

                // let netForce = [rotForce[0] - linForce[0], rotForce[1]*this.momentOfInertia + linForce[1]]
                // console.log(this.velocity, netForce, rotForce, linForce, this.rvelocity, this.absoluteVerticies[i])
                // this.velocity[1] -= 2*netForce[1]
                // this.rvelocity += netForce[0]/(this.momentOfInertia)
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
        ctx.moveTo(this.absoluteVerticies[0][0] + this.coords[0],this.absoluteVerticies[0][1] + this.coords[1])
        ctx.beginPath()
        for (let i = 0;i< this.absoluteVerticies.length;i++) {
            ctx.lineTo(this.absoluteVerticies[i][0] + this.coords[0],this.absoluteVerticies[i][1] + this.coords[1])
        }
        ctx.closePath()
        ctx.fillStyle = "blue"
        let AABB = this.getAABB()
        if (AABB.xmin < 0) {
            this.resolveContactStatic([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]])
            this.velocity[0] *= -elasticity
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
        let normal = this.getNormalVector(this.absoluteVerticies[0], this.absoluteVerticies[1])
        ctx.moveTo(normal[0][0] + this.coords[0], normal[0][1] + this.coords[1])
        ctx.lineTo(normal[1][0] + this.coords[0], normal[1][1] + this.coords[1])
        ctx.stroke()
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