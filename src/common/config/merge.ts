function MergeArrays(arr1: Array<any>, arr2: Array<any>) {
  const newarr = [];
  for (let i = 0; i < arr1.length; i++) {
    newarr.push({ ...arr1[i], ...arr2[i] });
  }
  return newarr;
}
//修改用户
function mergeStr(id, obj) {
  let str = '';
  Object.keys(obj).map((item) => {
    if (obj[item] !== id) str += item + "= '" + obj[item] + "',";
  });
  str = str.slice(0, -1);
  return str;
}

function imgAddress(img) {
  let img_src = '';
  img_src = img.path;
  img_src = img_src.replace(/\\/g, '/');
  img_src = 'http://localhost:3000/' + img_src.replace('public', 'static');
  return img_src;
}

export { MergeArrays, mergeStr, imgAddress };
