export const helpers = {
    eq: (a, b) => a === b,
    add: (a, b) => a + b,
    gt: (a, b) => a > b,
    lt: (a, b) => a < b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    range: (start, end) => {
        let array = [];
        for (let i = start; i <= end; i++) {
            array.push(i);
        }
        return array;
    },
    formatNumber: (number, decimals) => {
        return number.toFixed(decimals);
    }
};