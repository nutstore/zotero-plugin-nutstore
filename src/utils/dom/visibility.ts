/**
 * DOM 元素显隐控制工具函数
 * 使用 hidden 属性控制元素的显示和隐藏
 */

import { addClass, removeClass } from './class-names'

/**
 * 隐藏指定元素
 * @param element 要隐藏的 DOM 元素或元素 ID
 * @returns 被隐藏的元素
 */
export function hideElement(element: HTMLElement | string, win?: Window): HTMLElement {
  win ??= Zotero.getMainWindow()
  const el = typeof element === 'string' ? win.document.getElementById(element) : element

  if (!el) {
    throw new Error(`Element ${typeof element === 'string' ? element : 'provided'} not found`)
  }

  addClass(el, 'hidden')
  el.setAttribute('hidden', 'true')
  return el
}

/**
 * 显示指定元素
 * @param element 要显示的 DOM 元素或元素 ID
 * @returns 被显示的元素
 */
export function showElement(element: HTMLElement | string, win?: Window): HTMLElement {
  win ??= Zotero.getMainWindow()
  const el = typeof element === 'string' ? win.document.getElementById(element) : element

  if (!el) {
    throw new Error(`Element ${typeof element === 'string' ? element : 'provided'} not found`)
  }

  el.removeAttribute('hidden')
  removeClass(el, 'hidden')
  return el
}

/**
 * 切换元素的显示/隐藏状态
 * @param element 要切换状态的 DOM 元素或元素 ID
 * @returns 状态被切换的元素
 */
export function toggleElement(element: HTMLElement | string, win?: Window): HTMLElement {
  win ??= Zotero.getMainWindow()
  const el = typeof element === 'string' ? win.document.getElementById(element) : element

  if (!el) {
    throw new Error(`Element ${typeof element === 'string' ? element : 'provided'} not found`)
  }

  if (el.hasAttribute('hidden')) {
    el.removeAttribute('hidden')
  }
  else {
    el.setAttribute('hidden', 'true')
  }
  return el
}

/**
 * 根据条件显示或隐藏元素
 * @param element 要控制的 DOM 元素或元素 ID
 * @param condition 显示条件，true 显示元素，false 隐藏元素
 * @returns 被控制的元素
 */
export function setElementVisibility(element: HTMLElement | string, condition: boolean, win?: Window): HTMLElement {
  return condition ? showElement(element, win) : hideElement(element, win)
}

/**
 * 批量隐藏多个元素
 * @param elements 要隐藏的 DOM 元素或元素 ID 数组
 * @returns 被隐藏的元素数组
 */
export function hideElements(elements: (HTMLElement | string)[], win?: Window): HTMLElement[] {
  return elements.map(element => hideElement(element, win))
}

/**
 * 批量显示多个元素
 * @param elements 要显示的 DOM 元素或元素 ID 数组
 * @returns 被显示的元素数组
 */
export function showElements(elements: (HTMLElement | string)[], win?: Window): HTMLElement[] {
  return elements.map(element => showElement(element, win))
}

/**
 * 批量设置多个元素的显示状态
 * @param elements 要设置的 DOM 元素或元素 ID 数组
 * @param condition 显示条件，true 显示元素，false 隐藏元素
 * @returns 被设置的元素数组
 */
export function setElementsVisibility(elements: (HTMLElement | string)[], condition: boolean, win?: Window): HTMLElement[] {
  return condition ? showElements(elements, win) : hideElements(elements, win)
}

/**
 * 检查元素是否可见（hidden 属性不存在）
 * @param element 要检查的 DOM 元素或元素 ID
 * @returns 元素是否可见
 */
export function isElementVisible(element: HTMLElement | string, win?: Window): boolean {
  win ??= Zotero.getMainWindow()
  const el = typeof element === 'string' ? win.document.getElementById(element) : element

  if (!el) {
    throw new Error(`Element ${typeof element === 'string' ? element : 'provided'} not found`)
  }

  return !el.hasAttribute('hidden')
}
