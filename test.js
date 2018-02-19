var CryptoJS = require("crypto-js");
var fs = require('fs');

const gameResult = (seed, salt) => {
  const nBits = 52; // number of most significant bits to use

  // 1. HMAC_SHA256(message=seed, key=salt)  
  const hmac = CryptoJS.HmacSHA256(CryptoJS.enc.Hex.parse(seed), salt);
  seed = hmac.toString(CryptoJS.enc.Hex);

  // 2. r = 52 most significant bits
  seed = seed.slice(0, nBits / 4);
  const r = parseInt(seed, 16);

  // 3. X = r / 2^52
  let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)

  // 4. X = 99 / (1-X)
  X = 99 / (1 - X);

  // 5. return max(trunc(X), 100)
  const result = Math.floor(X);
  return Math.max(1, result / 100);
};


let currentHash = 'c3bf4c2f41786bca01ba51833e808aab1bc8293e4671a76180c40efde6f7d5b8';
let prevHash = null;
  for (let i = 0; i < 100000; i++) {
    let hash = String(prevHash ? CryptoJS.SHA256(String(prevHash)) : currentHash);
    let bust = gameResult(hash, '0000000000000000004d6ec16dafe9d8370958664c1dc422f452892264c59526');

    
    console.log(bust);
    fs.appendFileSync('message2.txt', bust + ',');
    prevHash = hash;
  }
