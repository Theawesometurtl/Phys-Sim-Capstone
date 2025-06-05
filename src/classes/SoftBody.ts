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
        this.playerControlled1 = playerControlled1;
        this.playerControlled2 = playerControlled2;
        this.dynamic = dynamic;
        this.gravityTrue = gravityTrue;
        this.coords = coords;
        this.spacing = spacing
        this.circleRatio = 0.25;
        this.physicsObjectArray= []
        this.springArray= []
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
              let particlePM: PointMass = new PointMass((new Vector([this.spacing + i * this.spacing + 0.01*this.spacing*j, this.spacing + j* this.spacing + 0.01*this.spacing*i, 0])).add(this.coords), .95);
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
                    let spring = new Spring(particle, neighbor, this.spacing*magnitude*1.5, 0.01*magnitude);
                    this.springArray.push(spring);
                    }
                }
                }
            }
        }
    }
    draw(ctx: CanvasRenderingContext2D): void {
        let centroid = this.centroidCalc()
        ctx.beginPath()
        ctx.fillStyle = "blue"
        this.findOutsidePoints().map((point: number[]) => {
            let newPoint = (new Vector(point)).subtract(centroid).normalize().scale(this.spacing*this.circleRatio*2).add(new Vector(point)).values
            ctx.lineTo(newPoint[0], newPoint[1])
            })
        ctx.closePath()
        ctx.fill()
        if (this.face) {
            ctx.fillStyle = "black"
            ctx.fillRect(centroid.values[0]-20, centroid.values[1] - 20, 10, 10);
            ctx.fillRect(centroid.values[0]+20, centroid.values[1] - 20, 10, 10);
            ctx.fillRect(centroid.values[0]-40, centroid.values[1]+10, 80, 10);

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
        this.springArray.map((value: Spring) => {
            value.update();
        });

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

}