// 百度小程序Api转换微信Api
const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const babelTypes = require('babel-types')
const filePath = path.resolve('../data/baidu.js')

const baiduMap = {
    navigateTo: 'switchTab'
}

const towx = function(babelTypes) {
    return {
        name: "baidu-to-wechat-api",
        visitor: {
            // 成员表达式
            MemberExpression(path, state) {
                console.log(`成员表达式:MemberExpression, 时间:${Date.now()}, 参数:${JSON.stringify(state)}`)
                // 如果 object 对应的节点匹配了模式 "process.env"
                if (path.get("object").node.name == "swan") {
                    // 这里返回结果为字符串字面量类型的节点
                    const key = path.toComputedKey();
                    if (babelTypes.isStringLiteral(key)) {
                        // path.replaceWith( newNode ) 用来替换当前节点
                        path.replaceWith(
                            // babelTypes.valueToNode( value ) 用来创建节点，如果value是字符串，则返回字符串字面量类型的节点
                            babelTypes.MemberExpression(
                                babelTypes.Identifier('wx'),
                                babelTypes.Identifier(baiduMap[key.value])
                            )
                        )
                    }
                }
            }
        }
    }
}

// 读取js文件字符串
const code = fs.readFileSync(filePath, 'utf-8')

// 输出转换之前的code
console.log(code)

// js字符串转 AST
const result = babel.transform(code, {
    plugins: [{
        //前面的Visitor
        visitor: towx(babelTypes).visitor
    }]
})

//输出转换之后的code
console.log(result.code)


