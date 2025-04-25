import { Circle } from "./circle";
import { ctx } from "./globals";
import { Polygon } from "./polygon";
import { Rigidbody } from "./rigidbody";
import { Vector, Matrix } from 'ts-matrix';



export function rigidbodyCollisionCheck(rigidbody1: Rigidbody, rigidbody2: Rigidbody) {
    if (rigidbody1.shape instanceof Polygon && rigidbody2.shape instanceof Polygon) {
        polygonPolygon(rigidbody1, rigidbody1)
    } 
    if (rigidbody1.shape instanceof Polygon && rigidbody2.shape instanceof Circle) {
        polygonCircle(rigidbody1, rigidbody2, rigidbody1.shape, rigidbody2.shape)
    } 
    if (rigidbody1.shape instanceof Circle && rigidbody2.shape instanceof Polygon) {
        polygonCircle(rigidbody2, rigidbody1, rigidbody2.shape, rigidbody1.shape)
    } 
    
}
function polygonPolygon(polygon1:Rigidbody, polygon2: Rigidbody) {
    
}
function polygonCircle(polygonRigidbody: Rigidbody, circleRigidbody: Rigidbody, polygon: Polygon, circle: Circle) {
    //check whether a vertex is within the circle
    for (let i=0;i< polygon.absoluteVerticies.length;i++){
        if (circle.isPointWithinCircle(polygon.absoluteVerticies[i])) {
            circleRigidbody.velocity[1] *= -1
            circleRigidbody.collision = true
        }

        let normal = polygon.getNormalVector(polygon.absoluteVerticies[i], polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length])
        //find slope of a line
        let slope = polygon.absoluteVerticies[i][1]-polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length][1]/polygon.absoluteVerticies[i][0]-polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length][0]
        //find the perpindicular slope
        let invSlope = -(1/slope)
        //if a line from the center of the circle with a slope perpindicular to our line doesn't intersect
        //with the polygon line segment when our circle line with the length of the radius spans out in
        //both directions, then there is no intersection

        //rise/run = y/x
        // sqrt(x**2 + y**2) = r

        //y*slope = x
        //r^2 -y^2 = x^2

        //sqrt(r^2-y^2) = x*slope

        //r^2 - x^2 = (x*slope)^2
        //r^2 = x^2(1 + slope^2)
        //x = sqrt((r^2)/1+slope^2)
        //y = x/slope

        let x = Math.sqrt(circle.radius**2 /(1+invSlope^2))
        let y = x/invSlope
        //then we find if the lines intersect

        let bias1 = polygon.absoluteVerticies[i][1] - polygon.absoluteVerticies[i][1]* slope
        let bias2 = circle.coords[1] - circle.coords[0]*invSlope
        // y = mx+b
        // m1x + b1 = m2x+b2
        // x(m1-m2) = b2-b1
        // x = (b2-b1)/(m1-m2)
        let intersectionx = (bias2-bias1)/(slope-invSlope)
        let intersectiony = slope*intersectionx + bias2
        
        let isLine1AtIntersection = (intersectionx< circle.coords[0] && intersectionx > circle.coords[0] + x) || (intersectionx> circle.coords[0] && intersectionx < circle.coords[0] + x)
        let isLine2AtIntersection = (intersectionx< circle.coords[0] && intersectionx > circle.coords[0] - x) || (intersectionx> circle.coords[0] && intersectionx < circle.coords[0] - x)
        let isLine3AtIntersection = (intersectionx< polygon.absoluteVerticies[i][0] && intersectionx > polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length][0]) || (intersectionx> polygon.absoluteVerticies[i][0] && intersectionx < polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length][0])
        
        ctx.strokeStyle = "red"
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(circle.coords[0], circle.coords[1])
        ctx.lineTo(intersectionx, intersectiony)
        ctx.stroke()
        ctx.fillRect(intersectionx, intersectiony,50,50)
        // console.log(intersectionx, intersectiony)
        // ctx.beginPath()
        // ctx.moveTo(circle.coords[0], circle.coords[1])
        // ctx.lineTo(intersectionx, intersectiony)
        // ctx.stroke()
        // console.log(slope, bias1, bias2)

        //find contacts using Seperating Axis Theorem

        let normalVector = new Vector(normal[0])
        let projectedLine = new Vector([polygon.absoluteVerticies[i][0] + polygon.coords[0], polygon.absoluteVerticies[i][1] + polygon.coords[1]]).dot(normalVector)
        let projectedCircleCenter = new Vector(circle.coords).dot(normalVector)
        if ((projectedLine < projectedCircleCenter && projectedLine > projectedCircleCenter - circle.radius) ) {
            let hi = projectedLine + circle.radius - projectedCircleCenter
            let hello = normalVector.scale(hi)
            circleRigidbody.coords[0] += hello.values[0]
            circleRigidbody.coords[1] += hello.values[1]
            circleRigidbody.velocity[1] *= -1
            circleRigidbody.collision = true
            // generalCollision(polygon.rigidbody, circle.rigidbody, [intersectionx, intersectiony])
        }
        if ((projectedLine > projectedCircleCenter && projectedLine < projectedCircleCenter + circle.radius )) {
            let hi = projectedLine - circle.radius - projectedCircleCenter
            let hello = normalVector.scale(hi)
            circleRigidbody.coords[0] += hello.values[0]
            circleRigidbody.coords[1] += hello.values[1]
            circleRigidbody.velocity[1] *= -1
            circleRigidbody.collision = true
            // generalCollision(polygon.rigidbody, circle.rigidbody, [intersectionx, intersectiony])
        }
    }
}
function generalCollision(rigidbody1: Rigidbody, rigidbody2: Rigidbody, point: number[]) {
    if (!(rigidbody1 instanceof Rigidbody) || !(rigidbody2 instanceof Rigidbody)) {
        console.error("rigidbody attribute of shape is null");
        stop()
    }
    //figure out momentum of point for each rigidbody
    // rigidbody1?.


}

//took this from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function intersects(point1: number[],point2: number[],point3: number[],point4:number[]) {
    var det, gamma, lambda;
    let a = point1[0]
    let b = point1[1]
    let c = point2[0]
    let d = point2[1]
    let p = point3[0]
    let q = point3[1]
    let r = point4[0]
    let s = point4[1]
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
      return false;
    } else {
      lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
      gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
      return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
  };
