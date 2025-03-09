import { vector } from "./types"

export function rotateVector(theta: number, vector: number[]) {
    let x = vector[0]*Math.cos(theta) - vector[1]*Math.sin(theta)
    let y = vector[0]*Math.sin(theta) + vector[1]*Math.cos(theta)
    return [x, y]
}