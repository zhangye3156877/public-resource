// 数组交集
function a(a, b) {
  const result = a.filter((item) => {
    return b.includes(item)
  })
  return result;
}
// 连续去重
function b(str) {
  let result = '';
  for(let i = 0 ;i < str.length;i++){
    if (str[i] === str[i + 1]){
      continue;
    }else {
      result += str[i];
    }
  }
  return result;
}
// 手写bind
Function.prototype.bind_ = function(ctx){
  const ctx_ = ctx || window;
  const fn = this;

  return function(...rest) {
    fn.call(ctx_, ...rest)
  };
}