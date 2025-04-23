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
        let slope = polygon.absoluteVerticies[i][1]/polygon.absoluteVerticies[i][0]

        if (true) {

        }
    }
}
function generalCollision(rigidbody: Rigidbody, point: number, force: vector) {

}
