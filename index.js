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
    return function elementGenerator(...args) {
        const idx = gen(...args);

        if (idx !== undefined) {
            return array[idx];
        }
    }
}

function property(object, gen = element(Object.keys(object))) {
    return function propertyGenerator(...args) {
        const key = gen(...args);

        if (key !== undefined) {
            return [key, object[key]];
        }
    }
}
