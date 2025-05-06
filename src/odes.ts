export function euler(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]
    }
    return yFinal
}
export function backwardsEuler(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    let y1 : number
    let deltaT = t1-t0
    for (let i=0; i<len;i++) {
        y1 = y0[i] + deltaT* dydt[i]
        yFinal[i] = y0[i] + deltaT* dydtFunc([y1], t1)[0]
    }
    return yFinal
}
export function modifiedEuler(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    let k1 : number
    let deltaT = t1-t0
    for (let i=0; i<len;i++) {
        k1 = deltaT* dydt[i]
        yFinal[i] = y0[i] + (k1 + deltaT* dydtFunc([k1 + y0[i]], t1)[0])/2
    }
    return yFinal
}
export function rungeKutta4thOrder(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    let k1: number
    let k2: number
    let k3: number
    let k4: number
    let deltaT = (t1-t0)
    for (let i=0; i<len;i++) {
        k1 = deltaT* dydt[i]/10
        k2 = dydtFunc([(k1/2) + y0[i]], t0 + deltaT/2)[0] * deltaT
        k3 = dydtFunc([(k2/2) + y0[i]], t0 + deltaT/2)[0] * deltaT
        k4 = dydtFunc([k3 + y0[i]], t0 + deltaT)[0] * deltaT
        yFinal[i] = y0[i] + (k1+ 2*k2 + 2* k3 + k4)/6
    }
    return yFinal
}


export type StateVectorDerivatives = (y: number[], t: number) => number[];
export type OrdinaryDifferentialEquationSolver = (y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives) => number[];
export type StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => number[];
