import { NodeIterator } from "./iterator"
import { Scope } from "./scope"

const HsunaJS = {
  // 解析方法
  parse(ast, extraDeclaration = {}) {
    const globalScope = new Scope("function")
    Object.keys(extraDeclaration).forEach((key) => {
      globalScope.addDeclaration(key, extraDeclaration[key])
    })
    const nodeIterator = new NodeIterator(null, globalScope)
    return nodeIterator.traverse(ast)
  },
  // 版本
  verison: process.env.VERSION,
}

export default HsunaJS
