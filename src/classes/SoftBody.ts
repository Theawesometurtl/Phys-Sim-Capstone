import { Vector } from "ts-matrix";
import { Circle } from "./circle";
import { PhysicsObject } from "./PhysicsObject";
import { PointMass } from "./pointMass";
import { Spring } from "./Spring";

export class SoftBody {
    physicsObjectArray: PhysicsObject[];
    springArray: Spring[];
    spacing: number;
    circleRatio: number;
    coords: Vector;
    playerControlled1: boolean;
    playerControlled2: boolean;
    dynamic: boolean;
    gravityTrue: boolean;
    face: boolean;
    faceType: boolean;
    springsOn: boolean;
    /**
     * Represents a soft body simulation with a grid of point masses connected by springs.
     * The soft body can be controlled by players and can be dynamic or static.
     * 
     * @param gridColumns - Number of columns in the grid of point masses.
     * @param gridRows - Number of rows in the grid of point masses.
     * @param coords - Initial coordinates for the center of the soft body.
     * @param playerControlled1 - Whether the first player can control the soft body.
     * @param playerControlled2 - Whether the second player can control the soft body.
     * @param dynamic - Whether the soft body is dynamic (affected by forces) or static.
     * @param gravityTrue - Whether gravity affects the soft body.
     * @param scaling - Scaling factor for the size of the soft body.
     * @param spacing - Spacing between the point masses in the grid.
     */
    /**
     * Creates an instance of SoftBody.
     * Initializes the physics objects and springs for a grid-like structure.
     */
    constructor(gridColumns: number = 2, gridRows: number = 2, coords: Vector = new Vector([100, 100, 0]), playerControlled1: boolean =true, playerControlled2: boolean = true, dynamic: boolean = true, gravityTrue: boolean = true, spacing: number = 100) {
        this.face = true;
        this.springsOn = true
        this.playerControlled1 = playerControlled1;
        this.playerControlled2 = playerControlled2;
        this.dynamic = dynamic;
        this.gravityTrue = gravityTrue;
        this.coords = coords;
        this.spacing = spacing
        this.circleRatio = 0.25;
        this.physicsObjectArray= []
        this.springArray= []
        this.faceType = Math.random() > 0.3;
        const directions = [
            [-1, -1, Math.sqrt(2)], [-1, 0, 1], [-1, 1, Math.sqrt(2)],
            [ 0, -1, 1],          [ 0, 1, 1],
            [ 1, -1, Math.sqrt(2)], [ 1, 0, 1], [ 1, 1, Math.sqrt(2)],
          ];
        let columns = gridColumns
        let rows = gridRows
        let circleRatio = .25
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
              let circleShape = new Circle(this.spacing*circleRatio)
              let particlePM: PointMass = new PointMass((new Vector([this.spacing + i * this.spacing + 0.01*this.spacing*j, this.spacing + j* this.spacing + 0.01*this.spacing*i, 0])).add(this.coords), .98);
              let particle = new PhysicsObject(circleShape, particlePM, playerControlled1, playerControlled2, dynamic, gravityTrue);
              this.physicsObjectArray[i*columns + j] = particle
              
            }
        }
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < columns; j++) {
                for (const [dx, dy, magnitude] of directions) {
        
                const ni = i + dx;
                const nj = j + dy;
        
                // Bounds check
                if (ni >= 0 && ni < rows && nj >= 0 && nj < columns) {
                    // Only add one direction to avoid duplicates
                    if (ni > i || (ni === i && nj > j)) {
                    let neighbor = this.physicsObjectArray[ni * columns + nj];
                    let particle = this.physicsObjectArray[i * columns + j];
                    let spring = new Spring(particle, neighbor, this.spacing*magnitude*1.5, 0.005*magnitude);
                    this.springArray.push(spring);
                    }
                }
                }
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D, colour: string | CanvasGradient | CanvasPattern = "blue", skeleton: boolean): void {
        if (!skeleton){
            let centroid = this.centroidCalc()
            ctx.beginPath()
            ctx.fillStyle = colour
            this.findOutsidePoints().map((point: number[]) => {
                let newPoint = (new Vector(point)).subtract(centroid).normalize().scale(this.spacing*this.circleRatio*2).add(new Vector(point)).values
                ctx.lineTo(newPoint[0], newPoint[1])
                })
            ctx.closePath()
            ctx.fill()
            if (this.face) {
                ctx.fillStyle = "black"
                let eye1 = [new Vector([-20, -20]),
                            new Vector([-10, -20]),
                            new Vector([-10, -10]),
                            new Vector([-20, -10])];
                let eye2 = [new Vector([20, -20]),
                            new Vector([10, -20]),
                            new Vector([10, -10]),
                            new Vector([20, -10])];
                let mouth1 = [new Vector([-40, 10]),
                            new Vector([40, 10]),
                            new Vector([40, 20]),
                            new Vector([-40, 20])];
                let mouth2 = [new Vector([0, 30]),
                            new Vector([15, 5]),
                            new Vector([-15, 5]),
                            new Vector([0, 30]),
                            new Vector([0, 25]),
                            new Vector([10, 10]),
                            new Vector([-10, 10]),
                            new Vector([0, 25])
                        ];
                let face1;
                if (this.faceType) {
                    face1 = [eye1, eye2, mouth1];
                    
                } else {
                    face1 = [eye1, eye2, mouth2];

                }
                

                this.drawShapes(ctx, face1, centroid);
                // ctx.fillRect(centroid.values[0]-20, centroid.values[1] - 20, 10, 10);
                // ctx.fillRect(centroid.values[0]+20, centroid.values[1] - 20, 10, 10);
                // ctx.fillRect(centroid.values[0]-40, centroid.values[1]+10, 80, 10);

            }
        } else {
            this.physicsObjectArray.map((value: PhysicsObject, index: number) => {
                value.shape.draw(colour)
                
            })
            
            if (this.springsOn) {
                this.springArray.map((value: Spring, index: number) => {
                    value.draw(ctx)
                })
            }
        }
    }
    cross(p1: number[], p2: number[], p3: number[]): number {
        // Calculate the cross product of vectors p1p2 and p1p3
        return (p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]);
    }
    findOutsidePoints() {
        //using convex hull algorithm to find outside points
        let points = this.physicsObjectArray.map((value: PhysicsObject) => value.shape.coords.values.slice(0, 2));
        points.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        const lower: number[][] = [];
        for (const p of points) {
            while (lower.length >= 2 && this.cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
                lower.pop();
            }
            lower.push(p);
        }
        const upper: number[][] = [];
        for (let i = points.length - 1; i >= 0; i--) {
            const p = points[i];
            while (upper.length >= 2 && this.cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
                upper.pop();
            }
            upper.push(p);
        }
        upper.pop(); // Remove the last point because it's repeated at the beginning of lower
        lower.pop(); // Remove the last point because it's repeated at the beginning of upper
        return lower.concat(upper);
    }
    update() {
        this.physicsObjectArray.map((value: PhysicsObject) => {
            value.update(1);
        });
        if (this.springsOn){
            this.springArray.map((value: Spring) => {
                value.update();
            });
        }
    }
    centroidCalc(): Vector {
        let x: number = 0;
        let y: number = 0;
        this.physicsObjectArray.map((value: PhysicsObject) => {
            x += value.shape.coords.values[0];
            y += value.shape.coords.values[1];
        });
        x = x / this.physicsObjectArray.length;
        y = y / this.physicsObjectArray.length;
        return new Vector([x, y]);
    }
    drawShapes(ctx: CanvasRenderingContext2D, coordinates: Vector[][], centroid: Vector) : void {
        // console.log(coordinates)
        for (let i=0; i<coordinates.length; i++) {
            ctx.beginPath();
            ctx.moveTo(coordinates[i][0].values[0] + centroid.values[0], coordinates[i][0].values[1] + centroid.values[1])
            // console.log(coordinates[i][0].values[0], coordinates[i][0].values[1])
            for (let j=1; j<coordinates[i].length; j++) {
                ctx.fillStyle = "black";
                ctx.lineWidth = 0;
                // ctx.fillRect(coordinates[i][j].values[0] + centroid.values[0], coordinates[i][j].values[1]+ centroid.values[1], 1, 1)
                // console.log(coordinates[i][j].values[0] + centroid.values[0], coordinates[i][j].values[1]+ centroid.values[1])
                ctx.lineTo(coordinates[i][j].values[0] + centroid.values[0], coordinates[i][j].values[1]+ centroid.values[1])
            }
            ctx.closePath()
            ctx.stroke();
            ctx.fill();
        }
    }

}