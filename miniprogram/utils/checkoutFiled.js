export default function checkoutField(params) {
  const obj = {
    ...params
  }
  let res = true
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const prop = obj[key];
      if (key !== 'remark' && prop.trim() === '') { // 备注可为空 其他不可为空
        res = false
      }
    }
  }
  return res
}