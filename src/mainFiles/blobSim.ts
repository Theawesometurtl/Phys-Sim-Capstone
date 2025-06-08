import { Vector } from 'ts-matrix';
import { Circle } from '../classes/circle';
import { PointMass } from '../classes/pointMass';
import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';
import { Spring } from '../classes/Spring';
import { rotationAndScalarsToMatrix } from '../VectorFunctions';
import { SoftBody } from '../classes/SoftBody';

canvas.width = window.innerWidth 
canvas.height = window.innerHeight 

let isToggled = false;

const toggleButton = document.getElementById('toggleButton');
toggleButton?.addEventListener('click', () => {
  isToggled = !isToggled;
  toggleButton.classList.toggle('toggled');
  // Example: pause or resume simulation
  // if (isToggled) { pause(); } else { resume(); }
});

const sqrt2 = Math.sqrt(2)
let circleShape1 = new Circle(25)
let circle1PM: PointMass = new PointMass(new Vector([100, 100, 0]))
let circle1 = new PhysicsObject(circleShape1, circle1PM, true, false, true, true)
let circleShape2 = new Circle(25)
let circle2PM: PointMass = new PointMass(new Vector([100, 300, 0]))
let circle2 = new PhysicsObject(circleShape2, circle2PM, false, true,  true, true)

let physicsObjectArray: PhysicsObject[] = [
//   circle1, 
//   circle2
]
let springArray: Spring[] = [
//   new Spring(circle1, circle2, 100, 0.001)
]

let softBody1 = new SoftBody(4,4,new Vector([300,300, 0]), true, true, true, true, .050*canvas.width + .05*canvas.height)
// let softBody2 = new SoftBody(2,3,new Vector([500,500, 0]), false, false, true, true)

softBody1.physicsObjectArray.map((value: PhysicsObject) => {
  physicsObjectArray.push(value)})
softBody1.springArray.map((value: Spring) => {
  springArray.push(value)})
// softBody2.physicsObjectArray.map((value: PhysicsObject) => {
//   physicsObjectArray.push(value)})
// softBody2.springArray.map((value: Spring) => {
//   springArray.push(value)})


let interval = setInterval(() => main(), 1000/fps)
interval

var getXY = function(e: TouchEvent ): { x: number, y: number } {
  var source = e.touches[0];
  return {
    x: source.clientX,
    y: source.clientY
  };
};

let initialFingerPosition: { x: number, y: number };
let fingerCount = 0
let startDrawing = function(e: TouchEvent) {
  fingerCount = e.touches.length
  e.preventDefault();
  initialFingerPosition = getXY(e);
  canvas.addEventListener('touchmove', draw, false);
  canvas.addEventListener('touchend', countFingers, false);
};

let userForces : Vector = new Vector([0,0,0]);

let countFingers = function(e: TouchEvent) {
  fingerCount = e.touches.length
  if (fingerCount === 1) {
    initialFingerPosition = getXY(e);
  }
};
let draw = function(e: TouchEvent) {
  e.preventDefault();
  let fingerPosition = getXY(e);
  userForces = userForces.add(new Vector([fingerPosition.x - initialFingerPosition.x, fingerPosition.y - initialFingerPosition.y, 0]));
  initialFingerPosition = fingerPosition;
};

canvas.addEventListener('touchstart', startDrawing);
function main() {
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
}})
springArray.map((value: Spring, index: number) => {
  value.update()
//   value.draw(ctx)
})

  physicsObjectArray.map((value: PhysicsObject, index: number) => {
    value.computer.force = value.computer.force.add(userForces.scale(0.1))
    value.updateForces()
    value.update(1)
    //   value.shape.draw()
  })
  userForces = new Vector([0,0,0])

  if (pressedKeys[32] || isToggled) {
      springArray.map((value: Spring, index: number) => {
          value.draw(ctx)
        })

        physicsObjectArray.map((value: PhysicsObject, index: number) => {
          value.shape.draw()
        })
    }
    else {
        softBody1.draw(ctx)
        // softBody2.draw(ctx)
        
    }






}