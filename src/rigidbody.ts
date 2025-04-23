import { rigidbodyCollisionCheck } from "./collisions"
import { canvas, ctx, elasticity, gravity, pressedKeys, rigidbody } from "./globals"
import { Polygon } from "./polygonShape"
import { rotateVector } from "./rotateVector"
export class Rigidbody {
    velocity: number[]
    rvelocity: number
    rotation: number
    mass: number
    linDrag: number
    playerControlled: boolean
    static rigidbodyAmount = 0
    rigidbodyNumber: number
    collision: boolean
    shape: Polygon 
    coords: number[]
    dynamic: boolean

    constructor(relVertices: number[][], coords: number[], playerControlled: boolean, dynamic: boolean ) {
        this.coords = coords
        this.shape = new Polygon(relVertices, this)
        this.dynamic = dynamic
        this.velocity = [0,0]
        this.rvelocity =  -1* Math.PI/100
        this.rotation = 0
        this.mass = 1
        this.linDrag = 1
        this.playerControlled = playerControlled
        this.rigidbodyNumber = Rigidbody.rigidbodyAmount
        Rigidbody.rigidbodyAmount ++;
        rigidbody[this.rigidbodyNumber] = this

        this.collision = false
    }

    velocityOfPoint(relativePoint: number[]) {
        let instantaneousRotationVector = rotateVector(Math.PI/2, relativePoint)
        let vOfPoint = [-this.velocity[0] + instantaneousRotationVector[0] * this.rvelocity, -this.velocity[1]+ instantaneousRotationVector[1] *this.rvelocity]
        return vOfPoint
    }


    
    linearVelocityOfPoint(point:number[], linearVelocity: number[], rotationalVelocity: number) {
        let v = [point[0] * rotationalVelocity + linearVelocity[0], point[1] * rotationalVelocity + linearVelocity[1]]
        return v
    }   
    energyCalc() {
        let kineticEnergy  = Math.abs((1/2)* this.shape.momentOfInertia*this.rvelocity**2) + (1/4) * this.mass * Math.sqrt(this.velocity[0]**2 + this.velocity[1]**2)**2
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
    update(frames: number) {
        this.collision = false
        if (this.playerControlled) {
        if (pressedKeys[87]) {
            this.coords[1] -= 4
        }
        if (pressedKeys[83]) {
            this.coords[1] += 4
        }
        if (pressedKeys[65]) {
            this.coords[0] -= 4
        }
        if (pressedKeys[68]) {
            this.coords[0] += 4
        }}
        // this.velocity[1] -= gravity *2
        this.coords[0] += this.velocity[0]*frames
        this.coords[1] += this.velocity[1]*frames
        this.velocity[0] *= this.linDrag
        this.velocity[1] *= this.linDrag
        this.rotation += this.rvelocity
        if (this.rotation > Math.PI*2) {
            this.rotation -= Math.PI*2
        } else if (this.rotation < 0) {
            this.rotation -= Math.PI*2
        }

        
        //bounding box 
        let AABB = this.shape.getAABB()
        
        



        
        for (let i =0;i<rigidbody.length; i++) {
            if (i != this.rigidbodyNumber) {
                if ((AABB.xmin < rigidbody[i].shape.AABB.xmin && AABB.xmax > rigidbody[i].shape.AABB.xmin) ||(AABB.xmin < rigidbody[i].shape.AABB.xmax && AABB.xmax > rigidbody[i].shape.AABB.xmax)){
                
                    if ((AABB.ymin < rigidbody[i].shape.AABB.ymin && AABB.ymax > rigidbody[i].shape.AABB.ymin) ||(AABB.ymin < rigidbody[i].shape.AABB.ymax && AABB.ymax > rigidbody[i].shape.AABB.ymax)){
                        rigidbodyCollisionCheck(rigidbody[i], this)
                    }
                }
            }
        }
        for (let i =0;i<this.shape.relVertices.length; i++) {
            if (this.shape.absoluteVerticies[i][1] + this.coords[1] -0.5 > canvas.height) {
                this.coords[1] = canvas.height - this.shape.absoluteVerticies[i][1]
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