function getMaxProduct(): { num1: number; num2: number; maxProduct: number } {
    const digits = [1, 3, 5, 7, 9];
    let maxProduct = 0;
    let bestPair: [number, number] = [0, 0];

    function generateNumbers(selected: number[], remaining: number[]) {
        if (selected.length > 0 && selected.length < digits.length) {
            const num1 = parseInt(selected.join(""));
            const num2 = parseInt(remaining.join(""));
            const product = num1 * num2;

            if (product > maxProduct) {
                maxProduct = product;
                bestPair = [num1, num2];
            }
        }

        for (let i = 0; i < remaining.length; i++) {
            generateNumbers([...selected, remaining[i]], [...remaining.slice(0, i), ...remaining.slice(i + 1)]);
        }
    }

    generateNumbers([], digits);

    return { num1: bestPair[0], num2: bestPair[1], maxProduct };
}

const result = getMaxProduct();
console.log(`최대 곱을 가지는 숫자 조합: ${result.num1}, ${result.num2}`);
console.log(`최대 곱: ${result.maxProduct}`);
