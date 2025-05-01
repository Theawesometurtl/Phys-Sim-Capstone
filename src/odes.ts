export function eulerODE(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]
    }
    return yFinal
}
export function eulerODE10x(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]/10
        for (let j=0;j<9;j++) {
            dydt = dydtFunc(yFinal, t0)
            yFinal[i] = yFinal[i] + (t1-t0)* dydt[i]/10
        }
    }
    return yFinal
}
export function rungeKutta2ndOrder(y0: number[], len: number, t0: number, t1: number, dydtFunc: (y: number[], t: number) => number[] ): number[] {
    let dydt = dydtFunc(y0, t0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]/10
        for (let j=0;j<9;j++) {
            dydt = dydtFunc(yFinal, t0)
            yFinal[i] = yFinal[i] + (t1-t0)* dydt[i]/10
        }
    }
    return yFinal
}


export type StateVectorDerivatives = (y: number[], t: number) => number[];
export type OrdinaryDifferentialEquationSolver = (y0: number[], len: number, t0: number, t1: number, dydtFunc: StateVectorDerivatives) => number[];
export type StateVectorPredictor = (y0: number[], len: number, t0: number, t1: number) => number[];
