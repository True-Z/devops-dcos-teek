/**
 * @tutorial https://prettier.nodejs.cn/docs/en/configuration.html
 */
module.exports = {
  printWidth: 180, // 指定打印机将换行的行长
  tabWidth: 2, // 指定每个缩进级别的空格数
  useTabs: false, // 用制表符而不是空格缩进行
  semi: false, // 在语句末尾打印分号
  singleQuote: true, // 使用单引号而不是双引号
  quoteProps: 'as-needed', // 引用对象中的属性时更改
  jsxSingleQuote: true, // 在JSX中使用单引号而不是双引号
  trailingComma: 'none', // 在多行逗号分隔的语法结构中尽可能打印尾随逗号
  bracketSpacing: true, // 打印对象文字中括号之间的空格
  bracketSameLine: true, // 将多行 HTML（HTML、JSX、Vue、Angular）元素的 > 放在最后一行的末尾，而不是单独放在下一行（不适用于自关闭元素）
  arrowParens: 'always', // 在唯一的箭头函数参数周围包括括号
  rangeStart: 0, // 仅格式化文件的一段。选项可用于格式化以给定字符偏移量开始的代码
  rangeEnd: Infinity, // 仅格式化文件的一段。选项可用于格式化以给定字符偏移量结束的代码
  requirePragma: false, // Prettier 可以将自己限制为仅格式化在文件顶部包含特殊注释  @prettier or @format（称为杂注）的文件
  insertPragma: false, // Prettier 可以在文件顶部插入一个特殊的 @format 标记，指定文件已使用 Prettier 进行了格式化
  proseWrap: 'preserve', // 默认情况下，Prettier 不会更改 markdown 文本中的换行
  htmlWhitespaceSensitivity: 'css', // 打印对象文字中括号之间的空格
  vueIndentScriptAndStyle: false, // 是否缩进 Vue 文件中 ＜script＞ 和 ＜style＞ 标记内的代码
  endOfLine: 'lf', // 行结尾形式
  embeddedLanguageFormatting: 'auto', // 控制 Prettier 是否格式化嵌入文件中的引用代码
  singleAttributePerLine: false // 在 HTML、Vue 和 JSX 中每行强制执行一个属性
}
