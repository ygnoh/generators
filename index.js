function integer(from = 0, to = Number.MAX_SAFE_INTEGER, step = 1) {
    return function() {
        if (from < to) {
            const result = from;

            from += step;

            return result;
        }
    };
}

function element(array, gen = integer(0, array.length)) {
    return function(...args) {
        const idx = gen(...args);

        if (idx !== undefined) {
            return array[idx];
        }
    }
}

function property(object, gen = element(Object.keys(object))) {
    return function(...args) {
        const key = gen(...args);

        if (key !== undefined) {
            return [key, object[key]];
        }
    }
}

function collect(gen, array) {
    return function(...args) {
        const value = gen(...args);

        if (value !== undefined) {
            array.push(value);
        }

        return value;
    }
}

function repeat(gen) {
    if (gen() !== undefined) {
        return repeat(gen);
    }
}

const arr = [];

repeat(collect(integer(0, 7), arr));

console.log(arr);

function harvest(gen) {
    const arr = [];

    repeat(collect(gen, arr));

    return arr;
}

console.log(harvest(integer(5, 9)));

function limit(gen ,count = 1) {
    return function(...args) {
        if (count >= 1) {
            count -= 1;

            return gen(...args);
        }
    }
}

function filter(gen, predicate) {
    return function filterGenerator(...args) {
        const value = gen(...args);

        if (value !== undefined && !predicate(value)) {
            return filterGenerator(...args);
        }

        return value;
    }
}

const thirds = harvest(filter(integer(0, 10), n => n % 3 === 0));

console.log(thirds);

function concat(...gens) {
    const next = element(gens);
    let gen = next();

    return function concatGenerator(...args) {
        if (gen !== undefined) {
            const value = gen(...args);

            if (value === undefined) {
                gen = next();

                return concatGenerator(...args);
            }

            return value;
        }
    }
}
