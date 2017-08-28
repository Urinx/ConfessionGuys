var CryptoJS = require('aes_2.js')
var pwd='########'

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function sleep(ms) { 
  var now = new Date(); 
  var exitTime = now.getTime() + ms; 
  while (true) { 
    now = new Date(); 
    if (now.getTime() > exitTime) return;
  } 
}

function aes_encrypt(word){
  return CryptoJS.AES.encrypt(word,pwd).toString();
}

function aes_decrypt(word){
  return CryptoJS.AES.decrypt(word,pwd).toString(CryptoJS.enc.Utf8);
}

module.exports = {
  formatTime: formatTime,
  sleep: sleep,
  aes_encrypt: aes_encrypt,
  aes_decrypt: aes_decrypt
}
