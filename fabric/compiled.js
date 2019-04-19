'use strict';

require('@babel/polyfill');

var ccvv = 1;
var arr = [1, [2, 3]];
var fn = function fn() {
  console.log(ccvv);
};
fn();
console.log(arr.flat());
