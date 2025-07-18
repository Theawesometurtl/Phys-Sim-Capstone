import { Vector } from 'ts-matrix';
import '../css/style.css'
import { canvas, ctx, fps, pressedKeys } from '../globals';
import { PhysicsObject } from '../classes/PhysicsObject';
import { generalCollisionResolver } from '../collisions';
import { Spring } from '../classes/Spring';
import { SoftBody } from '../classes/SoftBody';
let angrySound = new Audio("./audio/angry-cat-41822.mp3"); // buffers automatically when created
let calmingSound = new Audio("./audio/underwater-waves-5983.mp3"); // buffers automatically when created
let explosionSound = new Audio("./audio/explosion-42132.mp3"); // buffers automatically when created

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
// let circleShape1 = new Circle(25)
// let circle1PM: PointMass = new PointMass(new Vector([100, 100, 0]))
// let circle1 = new PhysicsObject(circleShape1, circle1PM, true, false, true, true)
// let circleShape2 = new Circle(25)
// let circle2PM: PointMass = new PointMass(new Vector([100, 300, 0]))
// let circle2 = new PhysicsObject(circleShape2, circle2PM, false, true,  true, true)

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

var getXY = function(e: TouchEvent | MouseEvent): { x: number, y: number } {
if (e instanceof TouchEvent) {
  var source = e.touches[0];
  return {
    x: source.clientX,
    y: source.clientY
  };
} else {
  return {
    x: (e as MouseEvent).clientX,
    y: (e as MouseEvent).clientY
    };
  }
};

let initialFingerPosition: { x: number, y: number };
let fingerCount = 0;
let isMouseDown = false;

let startDrawing = function(e: TouchEvent | MouseEvent) {
  if (e instanceof TouchEvent) {
    fingerCount = e.touches.length;
    e.preventDefault();
  } else {
    isMouseDown = true;
  }
  initialFingerPosition = getXY(e);
  if (e instanceof TouchEvent) {
    canvas.addEventListener('touchmove', draw, false);
    canvas.addEventListener('touchend', countFingers, false);
  } else {
    canvas.addEventListener('mousemove', draw, false);
    canvas.addEventListener('mouseup', stopDrawing, false);
    canvas.addEventListener('mouseleave', stopDrawing, false);
  }
};

let userForces: Vector = new Vector([0,0,0]);

let countFingers = function(e: TouchEvent) {
  fingerCount = e.touches.length;
  if (fingerCount === 1) {
    initialFingerPosition = getXY(e);
  }
  if (fingerCount === 0) {
    canvas.removeEventListener('touchmove', draw, false);
    canvas.removeEventListener('touchend', countFingers, false);
  }
};

let stopDrawing = function(e: MouseEvent) {
  isMouseDown = false;
  canvas.removeEventListener('mousemove', draw, false);
  canvas.removeEventListener('mouseup', stopDrawing, false);
  canvas.removeEventListener('mouseleave', stopDrawing, false);
};

let draw = function(e: TouchEvent | MouseEvent) {
  if (e instanceof TouchEvent) {
    e.preventDefault();
    let fingerPosition = getXY(e);
    userForces = userForces.add(new Vector([fingerPosition.x - initialFingerPosition.x, fingerPosition.y - initialFingerPosition.y, 0]));
    initialFingerPosition = fingerPosition;
  } else if (isMouseDown) {
    let mousePosition = getXY(e);
    userForces = userForces.add(new Vector([mousePosition.x - initialFingerPosition.x, mousePosition.y - initialFingerPosition.y, 0]));
    initialFingerPosition = mousePosition;
  }
};

canvas.addEventListener('touchstart', startDrawing, false);
canvas.addEventListener('mousedown', startDrawing, false);
let colour = "blue"
let explode = false
let redness = 0
let cooldown = false
let cooldownTimer = 0

physicsObjectArray.map((value: PhysicsObject, index: number) => {
      value.computer.momentum = new Vector([Math.random(), Math.random(), 0])
    }
  )
function main() {
  if (explode) {
    if (redness > 255) {
      softBody1.springsOn = false
      physicsObjectArray.map((value: PhysicsObject, index: number) => {
        value.computer.force = value.computer.force.add(new Vector([100*(Math.random() -0.5), 100*(Math.random() -0.5), 0]))
        value.updateForces()
      })
      explosionSound.play()
    }
    if (redness > 370) {
      explode = false
      softBody1.springsOn = true
      cooldown = true
      redness = 255
      angrySound.pause()
      explosionSound.pause()
      calmingSound.play();
    } else {
      redness +=1
    }
  }
  if (cooldown) {
    cooldownTimer+=1
    redness-= 1
    if (cooldownTimer > 255) {
      cooldown = false
      cooldownTimer = 0
    }
  }
  colour = `rgb(${redness}, 0, ${255 - redness})`
  ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
  physicsObjectArray.map((value: PhysicsObject, index: number) => {for (let i = index+1; i < physicsObjectArray.length; i++) {
    generalCollisionResolver(value, physicsObjectArray[i])
  }})


  physicsObjectArray.map((value: PhysicsObject, index: number) => {
    value.computer.force = value.computer.force.add(userForces.scale(0.1))
    value.updateForces()
    if (cooldown) {
      if (value.computer.momentum.length() > 500){
        value.computer.momentum.normalize().scale(70)
        value.computer.force.normalize()
      }
      value.computer.momentum = value.computer.momentum.scale(.5)
    }
    if (value.computer.momentum.length() > (canvas.width + canvas.height)/6) {
      explode = true
      angrySound.play();
    }
  })
  softBody1.update()

  userForces = new Vector([0,0,0])

  if (pressedKeys[32] || isToggled) {
    softBody1.draw(ctx, colour, true)
    
  } else {
    softBody1.draw(ctx, colour, false)      
  }
}