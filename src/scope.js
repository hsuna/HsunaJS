import {
    SimpleValue
} from './value'

import standardMap from './standardMap'

class Scope {
    constructor(type, parentScope) {
        // 作用域类型，区分函数作用域function和块级作用域block
        this.type = type
        // 父级作用域
        this.parentScope = parentScope
        // 全局作用域
        this.globalDeclaration = standardMap
        // 当前作用域的变量空间
        this.declaration = Object.create(null)
    }

    /*
     * get/set方法用于获取/设置当前作用域中对应name的变量值
       符合JS语法规则，优先从当前作用域去找，若找不到则到父级作用域去找，然后到全局作用域找。
       如果都没有，就报错
     */
    get(name) {
        if (this.declaration[name]) {
            return this.declaration[name]
        } else if (this.parentScope) {
            return this.parentScope.get(name)
        } else if (this.globalDeclaration[name]) {
            return this.globalDeclaration[name]
        }
        throw new ReferenceError(`${name} is not defined`)
    }

    set(name, value) {
        if (this.declaration[name]) {
            this.declaration[name] = value
        } else if (this.parentScope[name]) {
            this.parentScope.set(name, value)
        } else {
            throw new ReferenceError(`${name} is not defined`)
        }
    }

    /**
     * 根据变量的kind调用不同的变量定义方法
     */
    declare(name, value, kind = 'var') {
        if (kind === 'var') {
            return this.varDeclare(name, value)
        } else if (kind === 'let') {
            return this.letDeclare(name, value)
        } else if (kind === 'const') {
            return this.constDeclare(name, value)
        } else {
            throw new Error(`canjs: Invalid Variable Declaration Kind of "${kind}"`)
        }
    }

    varDeclare(name, value) {
        let scope = this
        // 若当前作用域存在非函数类型的父级作用域时，就把变量定义到父级作用域
        while (scope.parentScope && scope.type !== 'function') {
            scope = scope.parentScope
        }
        return scope.declaration[name] = new SimpleValue(value, 'var')
    }

    letDeclare(name, value) {
        // 不允许重复定义
        if (this.declaration[name]) {
            throw new SyntaxError(`Identifier ${name} has already been declared`)
        }
        return this.declaration[name] = new SimpleValue(value, 'let')
    }

    constDeclare(name, value) {
        // 不允许重复定义
        if (this.declaration[name]) {
            throw new SyntaxError(`Identifier ${name} has already been declared`)
        }
        return this.declaration[name] = new SimpleValue(value, 'const')
    }
}

export {
    Scope
}