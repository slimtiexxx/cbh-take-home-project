const crypto = require("crypto");

const generateHash = (data) => crypto.createHash("sha3-512").update(data).digest("hex")

module.exports = {
    generateHash
}
