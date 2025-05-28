export function euler(y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives ): number[] {
    let dydt = dydtFunc(t0, y0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]
    }
    return yFinal
}
export function backwardsEuler(y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives ): number[] {
    let dydt = dydtFunc(t0, y0)
    let yFinal = []
    let y1 : number
    let deltaT = t1-t0
    for (let i=0; i<len;i++) {
        y1 = y0[i] + deltaT* dydt[i]
        yFinal[i] = y0[i] + deltaT* dydtFunc(t1, [y1])[0]
    }
    return yFinal
}
export function modifiedEuler(y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives ): number[] {
    let dydt = dydtFunc(t0, y0)
    let yFinal = []
    let k1 : number
    let deltaT = t1-t0
    for (let i=0; i<len;i++) {
        k1 = deltaT* dydt[i]
        yFinal[i] = y0[i] + (k1 + deltaT* dydtFunc(t1, [k1 + y0[i]])[0])/2
    }
    return yFinal
}
export function rungeKutta4thOrder(y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives ): number[] {
    let dydt = dydtFunc(t0, y0)
    let yFinal: number[] = []
    let k1: number[] = []
    let k2: number[] = []
    let k3: number[] = []
    let k4: number[] = []
    let deltaT = (t1-t0)
    for (let i=0; i<len;i++) {
        k1[i] = deltaT* dydt[i]/10
    }

    k2 = dydtFunc(t0 + deltaT/2, k1.map((num: number, index: number) => num + y0[index])).map((value: number) => value*deltaT)
    k3 = dydtFunc(t0 + deltaT/2, k2.map((value: number, index: number) => value + y0[index])).map((value: number) => value*deltaT)

    k4 = dydtFunc(t0 + deltaT, k3.map((value: number, index: number) => value + y0[index])).map((value: number) => value*deltaT)
    yFinal = y0.map((value: number, index: number) => value + (k1[index], 2*k2[index], 2*k3[index], k4[index])/6)
    
    return yFinal
}


export type StateVectorDerivatives = (t: number, y: number[]) => number[];
export type OrdinaryDifferentialEquationSolver = (y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives) => number[];
export type StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => number[];
