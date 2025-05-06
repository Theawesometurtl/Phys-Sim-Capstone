import '../css/style.css'
import { canvas, ctx, fps } from '../globals';

import { Graph } from '../classes/graph';
import { approximateXSquared } from '../approximationOfXSquared'


canvas.width = window.innerWidth - 100
canvas.height = window.innerHeight - 100


let graph = new Graph(canvas, ctx)

let interval = setInterval(() => main(), 1000/fps)
interval



function main() {
    
    
}
graph.clear()
graph.drawAxes()
approximateXSquared(graph)

    




