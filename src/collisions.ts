import { Circle } from "./circle";
import { Polygon } from "./polygon";
import { Rigidbody } from "./rigidbody";
import { vector } from "./types";


export function rigidbodyCollisionCheck(rigidbody1: Rigidbody, rigidbody2: Rigidbody) {
    if (rigidbody1.shape instanceof Polygon && rigidbody2.shape instanceof Polygon) {
        polygonPolygon(rigidbody1, rigidbody1)
    } 

}
function polygonPolygon(polygon1:Rigidbody, polygon2: Rigidbody) {
    
}
function polygonCircle(polygon: Polygon, circle: Circle) {
    //check whether a vertex is within the circle
    for (let i=0;i< polygon.absoluteVerticies.length;i++){
        if (circle.isPointWithinCircle(polygon.absoluteVerticies[i])) {

        }
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

        let bias1 = circle.coords[1] - circle.coords[0]*invSlope
        let bias2 = polygon.absoluteVerticies[i][1] - polygon.absoluteVerticies[i][1]* slope
        //y = mx+b
        //m1x + b1 = m2x+b2
        //x(m1-m2) = b2-b1
        //x = (b2-b1)/(m1-m2)
        let intersectionx = (bias2-bias1)/(slope-invSlope)
        
        let isLine1AtIntersection = (intersectionx< circle.coords[0] && intersectionx > circle.coords[0] + x) || (intersectionx> circle.coords[0] && intersectionx < circle.coords[0] + x)
        let isLine2AtIntersection = (intersectionx< circle.coords[0] && intersectionx > circle.coords[0] - x) || (intersectionx> circle.coords[0] && intersectionx < circle.coords[0] - x)
        let isLine3AtIntersection = (intersectionx< polygon.absoluteVerticies[i][0] && intersectionx > polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length][0]) || (intersectionx> polygon.absoluteVerticies[i][0] && intersectionx < polygon.absoluteVerticies[(i+1)%polygon.absoluteVerticies.length][0])
        
        if ((isLine1AtIntersection || isLine2AtIntersection) && isLine3AtIntersection) {
            
        }
    }
}
function generalCollision(rigidbody: Rigidbody, point: number, force: vector) {

}
