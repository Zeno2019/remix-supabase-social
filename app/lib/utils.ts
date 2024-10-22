import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export function _setTimeout(callback: () => void, delay: number): () => void {
//   const expectedTime = Date.now() + delay
//   let rafId: number | null = null

//   const tick = () => {
//     const remaining = expectedTime - Date.now()

//     if (remaining <= 0) {
//       callback()
//     }
//     else {
//       rafId = requestAnimationFrame(tick)
//     }
//   }

//   rafId = requestAnimationFrame(tick)

//   // 返回取消函数
//   return () => {
//     if (rafId !== null) {
//       cancelAnimationFrame(rafId)
//     }
//   }
// }

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  function _debounceFunc(this: any, ...args: Parameters<T>): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
      timeoutId = null
    }, wait)
  }

  _debounceFunc.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return _debounceFunc
}
