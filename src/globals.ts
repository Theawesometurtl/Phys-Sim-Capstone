import { PhysicsObject } from "./classes/PhysicsObject";
import { Rigidbody } from "./classes/rigidbody";

let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
let ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
let gravity: number = -0.981
let elasticity: number = 1
let fps: number = 35
let pressedKeys : {[keyCode: number]: boolean} = {};
let physicsObjectArray: PhysicsObject[] = []

window.onkeyup = function(e) { pressedKeys[e.keyCode] = false; }
window.onkeydown = function(e) { pressedKeys[e.keyCode] = true; }
export {canvas, ctx, gravity, fps, elasticity, pressedKeys, physicsObjectArray}