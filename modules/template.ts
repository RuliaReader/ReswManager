/*
 * This module is where the html template strings are stored.
 */

const templateCache: Record<string, string> = {}

const getTemplate = (pageName: string): string => {
  return templateCache[pageName]
}

const setTemplate = (pageName: string, templateStr: string) => {
  templateCache[pageName] = templateStr
}

export {
  getTemplate,
  setTemplate
}
