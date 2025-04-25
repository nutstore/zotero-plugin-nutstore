/**
 * DOM 元素选择器工具函数
 * 提供各种获取 DOM 元素的方法
 */

/**
 * 通过 ID 获取元素
 * @param id 元素ID
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素或 null
 */
export function getElementById(id: string, win?: Window): HTMLElement | null {
  win ??= Zotero.getMainWindow()
  return win.document.getElementById(id)
}

/**
 * 通过 CSS 选择器获取单个元素
 * @param selector CSS 选择器
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的第一个元素或 null
 */
export function querySelector<T extends Element = HTMLElement>(
  selector: string,
  parent?: Element | Document | null,
  win?: Window,
): T | null {
  win ??= Zotero.getMainWindow()
  const doc = parent || win.document
  return doc.querySelector<T>(selector)
}

/**
 * 通过 CSS 选择器获取多个元素
 * @param selector CSS 选择器
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素列表
 */
export function querySelectorAll<T extends Element = HTMLElement>(
  selector: string,
  parent?: Element | Document | null,
  win?: Window,
): NodeListOf<T> {
  win ??= Zotero.getMainWindow()
  const doc = parent instanceof Element ? parent : win.document
  return doc.querySelectorAll<T>(selector)
}

/**
 * 通过类名获取元素
 * @param className 类名
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素列表
 */
export function getElementsByClassName(
  className: string,
  parent?: Element | Document | null,
  win?: Window,
): HTMLCollectionOf<Element> {
  win ??= Zotero.getMainWindow()
  const doc = parent instanceof Element ? parent : win.document
  return doc.getElementsByClassName(className)
}

/**
 * 通过标签名获取元素
 * @param tagName 标签名
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素列表
 */
export function getElementsByTagName(
  tagName: string,
  parent?: Element | Document | null,
  win?: Window,
): HTMLCollectionOf<Element> {
  win ??= Zotero.getMainWindow()
  const doc = parent instanceof Element ? parent : win.document
  return doc.getElementsByTagName(tagName)
}

/**
 * 通过名称获取元素
 * @param name 元素的 name 属性值
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素列表
 */
export function getElementsByName(
  name: string,
  parent?: Document | null,
  win?: Window,
): NodeListOf<HTMLElement> {
  win ??= Zotero.getMainWindow()
  const doc = parent || win.document
  return doc.getElementsByName(name) as NodeListOf<HTMLElement>
}

/**
 * 通过 XPath 表达式获取元素
 * @param xpath XPath 表达式
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素列表
 */
export function getElementsByXPath(
  xpath: string,
  parent?: Node | Document | null,
  win?: Window,
): Node[] {
  win ??= Zotero.getMainWindow()
  const doc = parent instanceof Node ? parent : win.document
  const result = win.document.evaluate(
    xpath,
    doc,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null,
  )

  const nodes: Node[] = []
  for (let i = 0; i < result.snapshotLength; i++) {
    const node = result.snapshotItem(i)
    if (node) {
      nodes.push(node)
    }
  }

  return nodes
}

/**
 * 通过 XPath 表达式获取单个元素
 * @param xpath XPath 表达式
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的第一个元素或 null
 */
export function getElementByXPath(
  xpath: string,
  parent?: Node | Document | null,
  win?: Window,
): Node | null {
  win ??= Zotero.getMainWindow()
  const doc = parent instanceof Node ? parent : win.document
  const result = win.document.evaluate(
    xpath,
    doc,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  )

  return result.singleNodeValue
}

/**
 * 获取最近的匹配指定选择器的祖先元素
 * @param element 起始元素
 * @param selector CSS 选择器
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的祖先元素或 null
 */
export function closest<T extends Element = HTMLElement>(
  element: Element,
  selector: string,
  win?: Window,
): T | null {
  win ??= Zotero.getMainWindow()
  return element.closest<T>(selector)
}

/**
 * 获取元素的所有子元素
 * @param parent 父元素
 * @returns 子元素列表
 */
export function getChildren(parent: Element): HTMLCollection {
  return parent.children
}

/**
 * 获取元素的第一个子元素
 * @param parent 父元素
 * @returns 第一个子元素或 null
 */
export function getFirstChild(parent: Element): Element | null {
  return parent.firstElementChild
}

/**
 * 获取元素的最后一个子元素
 * @param parent 父元素
 * @returns 最后一个子元素或 null
 */
export function getLastChild(parent: Element): Element | null {
  return parent.lastElementChild
}

/**
 * 获取元素的下一个兄弟元素
 * @param element 当前元素
 * @returns 下一个兄弟元素或 null
 */
export function getNextSibling(element: Element): Element | null {
  return element.nextElementSibling
}

/**
 * 获取元素的上一个兄弟元素
 * @param element 当前元素
 * @returns 上一个兄弟元素或 null
 */
export function getPreviousSibling(element: Element): Element | null {
  return element.previousElementSibling
}

/**
 * 获取元素的父元素
 * @param element 当前元素
 * @returns 父元素或 null
 */
export function getParent(element: Element): Element | null {
  return element.parentElement
}

/**
 * 创建一个新元素
 * @param tagName 标签名
 * @param options 元素选项
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 创建的元素
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  options?: ElementCreationOptions,
  win?: Window,
): HTMLElementTagNameMap[K] {
  win ??= Zotero.getMainWindow()
  return win.document.createElement(tagName, options)
}

/**
 * 安全地获取元素，如果找不到则抛出错误
 * @param selector CSS 选择器或元素 ID
 * @param parent 父元素或文档，默认为整个文档
 * @param win 窗口对象，默认为 Zotero 主窗口
 * @returns 找到的元素
 * @throws 如果找不到元素则抛出错误
 */
export function getElement<T extends Element = HTMLElement>(
  selector: string,
  parent?: Element | Document | null,
  win?: Window,
): T {
  win ??= Zotero.getMainWindow()

  // 首先尝试作为 ID 查找
  const byId = getElementById(selector, win) as T | null
  if (byId)
    return byId

  // 然后尝试作为选择器查找
  const bySelector = querySelector<T>(selector, parent, win)
  if (bySelector)
    return bySelector

  throw new Error(`Element not found: ${selector}`)
}

/**
 * 检查元素是否匹配指定的选择器
 * @param element 要检查的元素
 * @param selector CSS 选择器
 * @returns 是否匹配
 */
export function matches(element: Element, selector: string): boolean {
  return element.matches(selector)
}

/**
 * 获取表单元素的值
 * @param element 表单元素
 * @returns 元素的值
 */
export function getValue(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  return element.value
}

/**
 * 设置表单元素的值
 * @param element 表单元素
 * @param value 要设置的值
 */
export function setValue(
  element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  value: string,
): void {
  element.value = value
}
