import '../css/style.css'
import { canvas, ctx, fps } from '../globals';
import { Rigidbody } from '../classes/rigidbody';
import { Polygon } from '../classes/polygon';
import { Circle } from '../classes/circle';
import { PhysicsObject } from '../classes/PhysicsObject';
import { Matrix, Vector } from 'ts-matrix';
import { generalCollisionResolver } from '../collisions';

canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 10
let square = new Polygon(new Matrix(2, 4, [[0, 0, 50, 50], [0, 50, 50, 0]]))
let polygonRB: Rigidbody = new Rigidbody(new Vector([200, 100,0]))
let polygon: PhysicsObject = new PhysicsObject(square, polygonRB, false, true, true, false)
let weirdShape = new Polygon(new Matrix(2, 5, [[0, 0,50,50,100],[0,50,50,0,-100]]))
let weirdRB: Rigidbody = new Rigidbody(new Vector([400, 400, 0]))
let weird: PhysicsObject = new PhysicsObject(weirdShape,weirdRB, true, true, true, false)
let circleShape = new Circle(50)
let circleRB: Rigidbody = new Rigidbody(new Vector([100, 100, 0]))
let circle: PhysicsObject = new PhysicsObject(circleShape, circleRB, false, true, true, false)
// let canvasStaticBottom: Rigidbody = new Rigidbody([[0, canvas.height], [canvas.width, canvas.height], [canvas.width, canvas.height+100], [0, canvas.height+100]],[0,0],false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)

let physicsObjectArray: PhysicsObject[] = [polygon, weird, circle]


let interval = setInterval(() => main(), 1000/fps)
interval
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
      physicsObjectArray.map((value: PhysicsObject, index: number) => 
      { 
        value.updateForces()
        value.update(1)
        value.draw()
      })
      physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
        generalCollisionResolver(value, physicsObjectArray[i])
      }})
  // polygon.update(1)
  // polygon.draw()
  // weird.update(1)
  // weird.draw()
  // circle.update(1)
  // circle.draw()


}