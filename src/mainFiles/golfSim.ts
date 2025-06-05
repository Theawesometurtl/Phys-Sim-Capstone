import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { Rigidbody } from '../classes/rigidbody';
import { Polygon } from '../classes/polygon';
import { Circle } from '../classes/circle';
import { PhysicsObject } from '../classes/PhysicsObject';
import { Matrix, Vector } from 'ts-matrix';
import { PointMass } from '../classes/pointMass';
import { rotationAndScalarsToMatrix } from '../VectorFunctions';


canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10

let circleShape = new Circle(20)
let circlePM: PointMass = new PointMass(new Vector([50, canvas.height-50, 0]))
let circle = new PhysicsObject(circleShape, circlePM, true, false, true, true)
// let canvasStaticBottom: Rigidbody = new Rigidbody([[0, canvas.height], [canvas.width, canvas.height], [canvas.width, canvas.height+100], [0, canvas.height+100]],[0,0],false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)
let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)

  circle.update(1)
  circle.draw()
  if (pressedKeys[32]) {
    circlePM.momentum = new Vector([3, -7, 0])
  }
  let rotMatrix1 = rotationAndScalarsToMatrix(Math.atan2(circlePM.momentum.values[0],circlePM.momentum.values[1]), circlePM.momentum.length()/5, circlePM.momentum.length()/2)
  let arrowTip = circle.shape.drawArrow(circle.coords.values[0],circle.coords.values[1], rotMatrix1)
  circle.updateForces()
  let rotMatrix2 = rotationAndScalarsToMatrix(Math.atan2(circlePM.force.values[0],circlePM.force.values[1]), circlePM.force.length()*4, circlePM.force.length()*10)
  circle.shape.drawArrow(arrowTip[0], arrowTip[1], rotMatrix2, "red")

}