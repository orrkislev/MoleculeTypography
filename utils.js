const randomRange = (range) => random(range[0], range[1])
const round_random = (a = 1, b = 0) => Math.floor(random(a, b + 1))
const choose = (arr) => arr[Math.floor(random(arr.length))]
const repeat = (n, func) => { for(let i = 0; i < n; i++) func(i) }

Array.prototype.get = function get(i) {
    return this[i % this.length]
}
const timeout = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const array2d = (w, h, fill = (i,j)=>{}) => Array.from({length: h}, (_, i) => Array.from({length: w}, (_, j) => fill(i,j)))
const sum = (arr) => arr.reduce((a,b) => a + b, 0)

// Object.prototype.filter = function filter(func) {
//     const newObj = {}
//     for (let key in this) {
//         if (func(this[key], key)) newObj[key] = this[key]
//     }
//     return newObj
// }
// Object.prototype.length = function length() {
//     return Object.keys(this).length
// }
// Object.prototype.getKey = function getKey(i) {
//     return Object.keys(this)[i]
// }