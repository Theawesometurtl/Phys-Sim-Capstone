let canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement
let ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;
let gravity: number = -0.981
let elasticity: number = 1
let fps: number = 10
export {canvas, ctx, gravity, fps, elasticity}