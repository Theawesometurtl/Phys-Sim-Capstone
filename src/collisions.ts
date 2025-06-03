import { Circle } from "./classes/circle";
import { ctx } from "./globals";
import { PhysicsObject } from "./classes/PhysicsObject";
import { Polygon } from "./classes/polygon";
import { Vector, Matrix } from 'ts-matrix';
import { PhysicsComputer } from "./classes/PhysicsComputer";
import { Rigidbody } from "./classes/rigidbody";



export function generalCollisionResolver(physicsObject1: PhysicsObject, physicsObject2: PhysicsObject) {

    physicsObject1.shape.update()
    physicsObject2.shape.update()
    if (((physicsObject1.shape.AABB.xmin < physicsObject2.shape.AABB.xmin && physicsObject1.shape.AABB.xmax > physicsObject2.shape.AABB.xmin) ||(physicsObject1.shape.AABB.xmin <physicsObject2.shape.AABB.xmax && physicsObject1.shape.AABB.xmax >physicsObject2.shape.AABB.xmax)) &&((physicsObject1.shape.AABB.ymin <physicsObject2.shape.AABB.ymin && physicsObject1.shape.AABB.ymax >physicsObject2.shape.AABB.ymin) ||(physicsObject1.shape.AABB.ymin <physicsObject2.shape.AABB.ymax && physicsObject1.shape.AABB.ymax >physicsObject2.shape.AABB.ymax))){

    if (physicsObject1.shape instanceof Polygon && physicsObject2.shape instanceof Polygon) {
        polygonPolygon(physicsObject1, physicsObject2)
    } 
    if (physicsObject1.shape instanceof Polygon && physicsObject2.shape instanceof Circle) {
        if (physicsObject1.computer instanceof Rigidbody) {
            polygonCircle(physicsObject1, physicsObject1.computer, physicsObject2, physicsObject1.shape, physicsObject2.shape)
        }
    } 
    if (physicsObject1.shape instanceof Circle && physicsObject2.shape instanceof Polygon) {
        if (physicsObject2.computer instanceof Rigidbody) {
        polygonCircle(physicsObject2, physicsObject2.computer, physicsObject1, physicsObject2.shape, physicsObject1.shape)
        }
    } 
    if (physicsObject1.shape instanceof Circle && physicsObject2.shape instanceof Circle) {
        circleCircle(physicsObject1, physicsObject2, physicsObject1.shape, physicsObject2.shape)
    } }
    
}
function polygonPolygon(polygon1:PhysicsObject, polygon2: PhysicsObject) {
    
}
function polygonCircle(polygonPhysicsObject: PhysicsObject, rigidbodyComputer: Rigidbody, circlePhysicsObject: PhysicsObject, polygon: Polygon, circle: Circle) {
    //check whether a vertex is within the circle
    for (let i=0;i< polygon.absoluteVerticies.columns;i++){
        
        
        let normal = polygon.getNormalVector([polygon.absoluteVerticies.values[0][i], polygon.absoluteVerticies.values[1][i]], [polygon.absoluteVerticies.values[0][(i+1)%polygon.absoluteVerticies.columns], polygon.absoluteVerticies.values[1][(i+1)%polygon.absoluteVerticies.columns]])
        //find slope of a line
        let slope = polygon.absoluteVerticies.values[1][i]-polygon.absoluteVerticies.values[1][(i+1)%polygon.absoluteVerticies.columns]/polygon.absoluteVerticies.values[0][i]-polygon.absoluteVerticies.values[0][(i+1)%polygon.absoluteVerticies.columns]
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
        
        let bias1 = polygon.absoluteVerticies.values[1][i] - polygon.absoluteVerticies.values[1][i]* slope
        let bias2 = circle.coords.values[1] - circle.coords.values[0]*invSlope
        // y = mx+b
        // m1x + b1 = m2x+b2
        // x(m1-m2) = b2-b1
        // x = (b2-b1)/(m1-m2)
        let intersectionx = (bias2-bias1)/(slope-invSlope)
        let intersectiony = slope*intersectionx + bias2
        
        
        ctx.strokeStyle = "red"
        ctx.lineWidth = 5
        ctx.beginPath()
        ctx.moveTo(circle.coords.values[0], circle.coords.values[1])
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
        
        let projectedLine = new Vector([polygon.absoluteVerticies.values[0][i] + polygon.coords.values[0], polygon.absoluteVerticies.values[1][i] + polygon.coords.values[1]]).dot(normal)
        let projectedCircleCenter = new Vector(circle.coords.values).dot(normal)
        if ((projectedLine < projectedCircleCenter && projectedLine > projectedCircleCenter - circle.radius) ) {
            console.log("hi")
            let intersectionProjection = projectedLine + circle.radius - projectedCircleCenter
            let intersection = normal.scale(intersectionProjection)
            let contactDistanceA = intersection.add(circlePhysicsObject.computer.coords.negate())
            let contactDistanceB = intersection.add(rigidbodyComputer.coords.negate())
            let initialPointVelocity = circlePhysicsObject.computer.momentum.scale(1/circlePhysicsObject.mass)
            .add(polygonPhysicsObject.computer.momentum.scale(1/polygonPhysicsObject.mass))
            .add(rigidbodyComputer.angularMomentum.cross(contactDistanceB))
            impulseCalculation(1, initialPointVelocity, normal, circlePhysicsObject.mass, polygonPhysicsObject.mass, contactDistanceA, contactDistanceB, circlePhysicsObject.shape.momentOfInertia, circlePhysicsObject.shape.momentOfInertia)
            // generalCollision(polygon.rigidbody, circle.rigidbody, [intersectionx, intersectiony])
        }
        if ((projectedLine > projectedCircleCenter && projectedLine < projectedCircleCenter + circle.radius )) {
            console.log("hi")

            let intersectionProjection = projectedLine - circle.radius - projectedCircleCenter
            let intersection = normal.scale(intersectionProjection)
            let contactDistanceA = intersection.add(circlePhysicsObject.computer.coords.negate())
            let contactDistanceB = intersection.add(rigidbodyComputer.coords.negate())
            let initialPointVelocity = circlePhysicsObject.computer.momentum.scale(1/circlePhysicsObject.mass)
            .add(polygonPhysicsObject.computer.momentum.scale(1/polygonPhysicsObject.mass))
            .add(rigidbodyComputer.angularMomentum.cross(contactDistanceB))
            impulseCalculation(1, initialPointVelocity, normal, circlePhysicsObject.mass, polygonPhysicsObject.mass, contactDistanceA, contactDistanceB, circlePhysicsObject.shape.momentOfInertia, circlePhysicsObject.shape.momentOfInertia)
            
            // generalCollision(polygon.rigidbody, circle.rigidbody, [intersectionx, intersectiony])
        }
    }
}
function circleCircle(physicsObject1: PhysicsObject, physicsObject2: PhysicsObject, circle1:Circle,  circle2: Circle, ) {
    let centroidDifference = physicsObject1.coords.add(physicsObject2.coords.negate()).length()
    let combinedRadius = circle1.radius + circle2.radius
    // console.log(physicsObject1.coords, physicsObject1.computer.momentum, centroidDifference)
    if (centroidDifference < combinedRadius) {
        circle1.collision = true
        circle2.collision = true
        return
        // console.log(physicsObject1.computer.momentum)
        let thing = (combinedRadius - centroidDifference)
        let normalCentroidDifference = physicsObject2.coords.add(physicsObject1.coords.negate()).normalize()
        physicsObject1.computer.coords = physicsObject1.coords.add(normalCentroidDifference.scale(-thing))
        physicsObject2.computer.coords = physicsObject2.coords.add(normalCentroidDifference.scale(thing))
        
        let initialPointVelocity = (physicsObject1.computer.momentum.scale(1/physicsObject1.mass)).add(physicsObject2.computer.momentum.scale(-1/physicsObject2.mass))
        // console.log(physicsObject1.computer.momentum)
        // console.log(1, initialPointVelocity,normalCentroidDifference,physicsObject1.mass,physicsObject2.mass, normalCentroidDifference, normalCentroidDifference, circle1.momentOfInertia, circle2.momentOfInertia)
        let impulse = impulseCalculation(1, initialPointVelocity,normalCentroidDifference,physicsObject1.mass,physicsObject2.mass, normalCentroidDifference, normalCentroidDifference, circle1.momentOfInertia, circle2.momentOfInertia)

        physicsObject1.computer.momentum = physicsObject1.computer.momentum.add(normalCentroidDifference.scale(impulse/1.5))
        physicsObject2.computer.momentum = physicsObject2.computer.momentum.add(normalCentroidDifference.scale(-impulse/1.5))
        // console.log(impulse)
        

        // let projectedVelocity1 = normalCentroidDifference.dot(physicsObject1.momentum)
        // let projectedVelocity2 = normalCentroidDifference.dot(physicsObject2.momentum)

        // let a = 2
        // let b = -(projectedVelocity1 + projectedVelocity2)
        // let c = (projectedVelocity1*projectedVelocity2)

        // let newProjectedVelocity2 = (-b +/*idk if physicsObject1 is plus or minus*/
        //     Math.sqrt(b**2 -4*a*c)
        // )/(2*a)
    }
}
function generalCollision(physicsObject1: PhysicsObject, physicsObject2: PhysicsObject, point: number[]) {
    if (!(physicsObject1 instanceof PhysicsObject) || !(physicsObject2 instanceof PhysicsObject)) {
        console.error("rigidbody attribute of shape is null");
        stop()
    }
    //figure out momentum of point for each rigidbody
    // physicsObject1?.


}
// took physicsObject1 formula from https://www.myphysicslab.com/engine2D/collision-en.html
function impulseCalculation(elasticity: number, initialPointVelocity: Vector, normal: Vector, massA: number,
    massB: number, contactDistanceA: Vector, contactDistanceB: Vector, inertiaA: number, inertiaB: number
) {
    let contactDistanceACrossNormal = contactDistanceA.cross(normal)
    let contactDistanceBCrossNormal = contactDistanceB.cross(normal)
    let impulse = initialPointVelocity.scale(-(1 + elasticity)).dot(normal)/(1/massA + 1/massB + contactDistanceACrossNormal.dot(contactDistanceACrossNormal)/inertiaA + contactDistanceBCrossNormal.dot(contactDistanceBCrossNormal)/inertiaB)
    // console.log(initialPointVelocity.scale(-(1 + elasticity)).dot(normal), )
    return impulse
}

//took physicsObject1 from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
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
