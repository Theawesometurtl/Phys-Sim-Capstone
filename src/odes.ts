export function eulerODE(y0: number[], len: number, t0: number, t1: number, dydtFunc: (x: number[]) => number[] ): number[] {
    let dydt = dydtFunc(y0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]
    }
    return yFinal
}
export function eulerODE10x(y0: number[], len: number, t0: number, t1: number, dydtFunc: (x: number[]) => number[] ): number[] {
    let dydt = dydtFunc(y0)
    let yFinal = []
    for (let i=0; i<len;i++) {
        yFinal[i] = y0[i] + (t1-t0)* dydt[i]/10
        for (let j=0;j<9;j++) {
            dydt = dydtFunc(yFinal)
            yFinal[i] = yFinal[i] + (t1-t0)* dydt[i]/10
        }
    }
    return yFinal
}