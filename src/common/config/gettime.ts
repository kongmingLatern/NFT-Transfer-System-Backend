//获取当前时间，格式YYYY-MM-DD
function getTime() {
  const date = new Date();
  const seperator1 = '-';
  const year = date.getFullYear();
  const mont = date.getMonth() + 1;
  const strDat = date.getDate();
  let month;
  let strDate;
  if (mont >= 1 && mont <= 9) {
    month = '0' + mont;
  }
  if (strDat >= 0 && strDat <= 9) {
    strDate = '0' + strDat;
  }
  const currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

export { getTime };
