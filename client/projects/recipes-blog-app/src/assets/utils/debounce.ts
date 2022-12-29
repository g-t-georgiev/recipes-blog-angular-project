export function debounce(cb: (...args: any[]) => void, timeout: number = 0) {
    let timer!: string | number | NodeJS.Timeout | undefined;

    return new Proxy(cb, {
        apply(target, thisArg, args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                Reflect.apply(target, thisArg, args);
            }, timeout);
        }
    });
}