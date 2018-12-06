import { Parser } from 'acorn'
import { NodeIterator } from './iterator'
import { Scope } from './scope'

export default class HsunaJs {
    constructor(code = '', extraDeclaration = {}) {
        this.code = code
        this.extraDeclaration = extraDeclaration
        this.ast = Parser.parse(code)
        this.nodeIterator = null
        this.init()
    }

    init() {
        const globalScope = new Scope('function')
        Object.keys(this.extraDeclaration).forEach((key) => {
            globalScope.addDeclaration(key, this.extraDeclaration[key])
        })
        this.nodeIterator = new NodeIterator(null, globalScope)
    }

    run() {
        return this.nodeIterator.traverse(this.ast)
    }
}