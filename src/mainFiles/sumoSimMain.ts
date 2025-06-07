import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';
import { rotationAndScalarsToMatrix } from '../VectorFunctions';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let circleShape1 = new Circle(25)
let sumoBot1PM: PointMass = new PointMass(new Vector([347, 100, 0]))
let sumoBot1 = new PhysicsObject(circleShape1, sumoBot1PM, true, false, true, false)
let circleShape2 = new Circle(25)
let sumoBot2PM: PointMass = new PointMass(new Vector([300, 300, 0]));
let sumoBot2: PhysicsObject = new PhysicsObject(circleShape2, sumoBot2PM, false, true,  true, false)

let physicsObjectArray: PhysicsObject[] = [
  sumoBot1, 
  sumoBot2
]



let interval = setInterval(() => main(), 1000/fps)
interval

const totalRadius = 100
let t=0
function main() {
  t+=1/100;
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
  }})
  // ctx.lineWidth = 10
  // ctx.strokeStyle = 'black'
  // ctx.beginPath()
  // ctx.moveTo(100, 100)
  // ctx.lineTo(100, canvas.width-100)
  // ctx.lineTo(canvas.height-100, canvas.width-100)
  // ctx.lineTo(canvas.height-100, 100)
  // ctx.lineTo(100, 100)
  // ctx.lineTo(100, canvas.width-100)
  // ctx.stroke()
  // ctx.lineWidth = 2

  sumoBot1.updateForces()
  sumoBot1.update(1)
  sumoBot1.draw()
  let rotMatrix1 = rotationAndScalarsToMatrix(Math.PI/2, sumoBot1PM.momentum.values[0]/5, sumoBot1PM.momentum.values[0]/2)
  let rotMatrix2 = rotationAndScalarsToMatrix(0, sumoBot1PM.momentum.values[1]/5, sumoBot1PM.momentum.values[1]/2)
  
  sumoBot2.updateForces()
  sumoBot2.update(1)
  sumoBot2.draw()
  let rotMatrix = rotationAndScalarsToMatrix(Math.atan2(sumoBot1PM.momentum.values[0],sumoBot1PM.momentum.values[1]), sumoBot1PM.momentum.length()/5, sumoBot1PM.momentum.length()/2)
  let rotMatrix3 = rotationAndScalarsToMatrix(Math.atan2(sumoBot2PM.momentum.values[0],sumoBot2PM.momentum.values[1]), sumoBot2PM.momentum.length()/5, sumoBot2PM.momentum.length()/2)
  if (pressedKeys[32]) {
    let arrowTip = sumoBot1.shape.drawArrow(sumoBot1.coords.values[0], sumoBot1.coords.values[1], rotMatrix1)
    sumoBot1.shape.drawArrow(arrowTip[0], arrowTip[1], rotMatrix2)
  }
  else {
    sumoBot1.shape.drawArrow(sumoBot1.coords.values[0],sumoBot1.coords.values[1], rotMatrix)

  }
  sumoBot1.shape.drawArrow(sumoBot2.coords.values[0],sumoBot2.coords.values[1], rotMatrix3)
  
  // let s =Math.abs( Math.sin(t))*totalRadius
  // let radius1 = totalRadius - s
  // let radius2 = s
  // let coordArray1 = [200, 200]
  // let coordArray2 = [300, 200]
  // let rotMatrix1 = rotationAndScalarsToMatrix(Math.PI/2, 0.5 + 9*radius1/totalRadius, radius1/5)
  // let rotMatrix2 = rotationAndScalarsToMatrix(Math.PI/2, .5 + 3*radius2/totalRadius, radius2/15)
  // let rotMatrix3 = rotationAndScalarsToMatrix(Math.PI/2, .5 + 3, totalRadius/15)

        // ctx.lineWidth = 2
        // ctx.strokeStyle = "white"

        // ctx.beginPath();
        // ctx.arc(coordArray1[0], coordArray1[1], radius1, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.fillStyle = "blue"
        // // if (this.collision) {
        // //     ctx.fillStyle = "red"
        // // }
        // ctx.fill()
        // ctx.fillStyle = "black"
        // ctx.fillRect(coordArray1[0], coordArray1[1], 1, 1)

        // ctx.lineWidth = 2
        // ctx.strokeStyle = "white"

        // ctx.beginPath();
        // ctx.arc(coordArray2[0], coordArray2[1], radius2, 0, 2 * Math.PI);
        // ctx.stroke();
        // ctx.fillStyle = "blue"
        // // if (this.collision) {
        // //     ctx.fillStyle = "red"
        // // }
        // ctx.fill()
        // ctx.fillStyle = "black"
        // ctx.fillRect(coordArray2[0], coordArray2[1], 1, 1)

    // let arrowTip = circleShape1.drawArrow(coordArray1[0], coordArray1[1], rotMatrix1, "orange")
    // circleShape2.drawArrow(arrowTip[0], arrowTip[1], rotMatrix2)
    // circleShape1.drawArrow(coordArray1[0], coordArray1[1] + 50, rotMatrix3, "orange")
}