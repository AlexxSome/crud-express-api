const crypto = require('crypto');

function generateUUID() {
    const array = new Uint32Array(4);
    crypto.randomFillSync(array);

    let uuid = '';
    for (let i = 0; i < array.length; i++) {
        uuid += ('00000000' + array[i].toString(16)).slice(-8);
    }

    return uuid;
};

module.exports ={ generateUUID };