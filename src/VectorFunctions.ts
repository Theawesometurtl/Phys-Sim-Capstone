import { Matrix } from "ts-matrix"

export function rotationAndScalarsToMatrix(rotation: number, xscalar: number = 1, yscalar: number = 1): Matrix {
    let rotMatrix = new Matrix(2, 2, [[Math.cos(rotation), Math.sin(rotation)], [-Math.sin(rotation), Math.cos(rotation)]])
    let scaleMatrix = new Matrix(2, 2, [[xscalar, 0], [0, yscalar]])
    return rotMatrix.multiply(scaleMatrix)

}