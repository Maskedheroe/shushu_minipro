const throttle = (fn, delay = 300) =>  {
  // 这里始终记得字节二面的时候，建议我不写 flag 好家伙
  let isThrottling = false
  // 核心思路，函数多次执行只有当 isThrottling 为 false 时才会进入函数体
  return function (...args) {
    if (!isThrottling) {
      isThrottling = true
      setTimeout(() => {
        isThrottling = false
        fn.apply(this, args)
      }, delay)
    }
  }
}
export default throttle