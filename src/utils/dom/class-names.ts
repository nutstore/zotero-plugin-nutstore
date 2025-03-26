/**
 * Utility functions for manipulating Tailwind CSS class names
 */

/**
 * Combines multiple class name strings, filtering out falsy values
 * @param classes - Class names to combine
 * @returns Combined class string
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Checks if an element has a specific class
 * @param element - DOM element to check
 * @param className - Class name to check for
 * @returns True if the element has the class
 */
export function hasClass(element: HTMLElement, className: string): boolean {
  return element.classList.contains(className)
}

/**
 * Adds one or more classes to an element
 * @param element - DOM element to modify
 * @param classNames - Class names to add (space-separated string or array)
 */
export function addClass(element: HTMLElement | XULElement, classNames: string | string[]): void {
  const classes = Array.isArray(classNames) ? classNames : classNames.split(' ')
  element.classList.add(...classes.filter(Boolean))
}

/**
 * Removes one or more classes from an element
 * @param element - DOM element to modify
 * @param classNames - Class names to remove (space-separated string or array)
 */
export function removeClass(element: HTMLElement, classNames: string | string[]): void {
  const classes = Array.isArray(classNames) ? classNames : classNames.split(' ')
  element.classList.remove(...classes.filter(Boolean))
}

/**
 * Toggles one or more classes on an element
 * @param element - DOM element to modify
 * @param classNames - Class names to toggle (space-separated string or array)
 * @param force - Optional boolean to force add (true) or remove (false)
 */
export function toggleClass(
  element: HTMLElement,
  classNames: string | string[],
  force?: boolean,
): void {
  const classes = Array.isArray(classNames) ? classNames : classNames.split(' ')
  classes.filter(Boolean).forEach((cls) => {
    element.classList.toggle(cls, force)
  })
}

/**
 * Replaces one class with another on an element
 * @param element - DOM element to modify
 * @param oldClass - Class to remove
 * @param newClass - Class to add
 */
export function replaceClass(
  element: HTMLElement,
  oldClass: string,
  newClass: string,
): void {
  element.classList.remove(oldClass)
  element.classList.add(newClass)
}

/**
 * Adds or removes a class based on a condition
 * @param element - DOM element to modify
 * @param className - Class to add or remove
 * @param condition - If true, add the class; if false, remove it
 */
export function setClass(
  element: HTMLElement,
  className: string,
  condition: boolean,
): void {
  if (condition) {
    element.classList.add(className)
  }
  else {
    element.classList.remove(className)
  }
}

/**
 * Parses a string of class names into an array
 * @param classString - Space-separated class string
 * @returns Array of class names
 */
export function parseClassNames(classString: string): string[] {
  return classString.trim().split(/\s+/).filter((cls): cls is string => Boolean(cls))
}

/**
 * Gets all classes from an element
 * @param element - DOM element to get classes from
 * @returns Array of class names
 */
export function getClasses(element: HTMLElement): string[] {
  return Array.from(element.classList).filter((cls): cls is string => Boolean(cls))
}
