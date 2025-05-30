import '../css/style.css'
import { canvas, ctx, fps } from '../globals';
import { Rigidbody } from '../classes/rigidbody';
import { Polygon } from '../classes/polygon';
import { Circle } from '../classes/circle';
import { Graph } from '../classes/graph';
import { PhysicsObject } from '../classes/PhysicsObject';
import { Matrix, Vector } from 'ts-matrix';
import { PointMass } from '../classes/pointMass';

canvas.width = window.innerWidth/2 - 100
canvas.height = window.innerHeight - 30
let canvas2: HTMLCanvasElement = document.getElementById("canvas2") as HTMLCanvasElement
let ctx2: CanvasRenderingContext2D = canvas2.getContext("2d") as CanvasRenderingContext2D;

let circleShape = new Circle(50)
let circlePM: PointMass = new PointMass(new Vector([100, 100]))
let circle = new PhysicsObject(circleShape, circlePM, true, true, true)
// let canvasStaticBottomShape = new Polygon(new Matrix(2, 4, [[0, canvas.width, canvas.width, 0], [canvas.height, canvas.height, canvas.height+10000, canvas.height+10000]]))
// let canvasStaticBottomRB: Rigidbody = new Rigidbody(new Vector([canvas.width/2,canvas.height -10 + 5000]))
// let canvasStaticBottom = new PhysicsObject(canvasStaticBottomShape, canvasStaticBottomRB, false,false,false)
// let canvasStaticLeft: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[0,0],false,false)
// let canvasStaticRight: Rigidbody = new Rigidbody([[0, 0], [0, canvas.height], [-100, canvas.height], [-100, 0]],[canvas.width,0],false,false)

let graph = new Graph(canvas2, ctx2)
graph.drawDifferentialPhysics(circlePM.dydt.bind(new PointMass(new Vector([100, 100]))))
let point
let interval = setInterval(() => main(), 1000/fps)
interval
let timer = 0
let canvasHeightDifference = -canvas.height +canvas2.height
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  circle.update(1)
  circle.draw()
  point = graph.coordinateToPosition([circlePM.momentum.values[1]*1,0])
  graph.continueCurve([point[0], circlePM.coords.values[1] + canvasHeightDifference + 50])
  console.log(point, circlePM.momentum)
  timer = 0
  // canvasStaticBottom.draw()
  // canvasStaticBottom.update(1)
  // let rungeKutta4thOrderStateVectorPredictor: StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => rungeKutta4thOrder(y0, len, t0, t1, dStateVector);
  
}