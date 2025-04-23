import { Polygon } from "./polygonShape";
import { Rigidbody } from "./rigidbody";
import { vector } from "./types";


export function rigidbodyCollisionCheck(rigidbody1: Rigidbody, rigidbody2: Rigidbody) {
    if (rigidbody1.shape instanceof Polygon && rigidbody2.shape instanceof Polygon) {
        polygonPolygon(rigidbody1, rigidbody1)
    } 

}
function polygonPolygon(polygon1:Rigidbody, polygon2: Rigidbody) {
    
}
function generalCollision(rigidbody: Rigidbody, point: number, force: vector) {

}
