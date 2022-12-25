export class Range implements Iterator<number> {
   
    constructor(
        private current: number,
        private total: number
    ) { }

    next() {
        const done = this.current === this.total;
        const value = this.current++;

        return { done, value };
    }

}

