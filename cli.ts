import { brightBlue, brightCyan, printf } from './deps.ts'

export const countWords = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    ;(str[i].match(/[ -~]/)) ? len += 1 : len += 2
  }
  return len
}
export const fillWithSpace = (str: string, len: number) => {
  for (let i = countWords(str); i <= len; i++) {
    str += ' '
  }
  return str + ' '
}
type FileInfo = {
  name: string
  type: string
}
export async function getFileListData() {
  let count = 0
  let maxLen = 0
  const fileList: Array<FileInfo> = []

  for await (const dirEntry of Deno.readDir('./')) {
    if (dirEntry.isDirectory) {
      fileList.push({
        name: dirEntry.name,
        type: 'dir',
      })
    } else if (dirEntry.isSymlink) {
      fileList.push({
        name: dirEntry.name,
        type: 'symlink',
      })
    } else {
      fileList.push({
        name: dirEntry.name,
        type: 'file',
      })
    }
    if (maxLen < countWords(dirEntry.name)) {
      maxLen = countWords(dirEntry.name)
    }
    count++
  }
  return JSON.stringify(
    {
      count: count,
      maxLen: maxLen,
      list: fileList,
    },
  )
}
const fileListData = await getFileListData().then((c) => JSON.parse(c))
const fileList = fileListData.list

const consoleSize = Deno.consoleSize()
const consoleWidth = consoleSize.columns
const rows = Math.floor(consoleWidth / (fileListData.maxLen))
const cols = Math.floor(fileListData.count / rows)
const endCols = fileListData.count - (cols * rows)

let line: { name: string; type: string }[] = []
const table: { name: string; type: string }[][] = []
const maxLength: number[] = []
//console.log(fileList)
//console.log(fileListData.maxLen)
/*console.log(
  `ファイル数:${fileListData.count} 行:${cols} 列:${rows} 最後の行:${endCols}`,
)*/

if (cols === 0) {
  fileList.forEach((e: { name: string; type: string }) => {
    if (e.type === 'dir') {
      printf(brightBlue(e.name))
    } else if (e.type === 'symlink') {
      printf(brightCyan(e.name))
    } else {
      printf(e.name)
    }
    printf('  ')
  })
} else {
  for (let row = 0; row < rows; ++row) {
    line = []
    for (let col = 0; col < cols; ++col) {
      const file = fileList.shift()
      line.push(file)
      if (isNaN(maxLength[row]) || maxLength[row] < countWords(file.name)) {
        maxLength[row] = countWords(file.name)
      }
    }
    table.push(line)
  }
  if (endCols !== 0) {
    line = []
    fileList.forEach((e: { name: string; type: string }) => {
      line.push(e)
    })
    table.push(line)
  }
  let isPrint = false
  for (let col = 0; col < cols; ++col) {
    isPrint = false
    for (let row = 0; row <= rows; ++row) {
      if (row !== rows || col < endCols) {
        isPrint = true
        const file: { name: string; type: string } = table[row][col]
        const filledName = fillWithSpace(file.name, maxLength[row])
        if (file.type === 'dir') {
          printf(brightBlue(filledName))
        } else if (file.type === 'symlink') {
          printf(brightCyan(filledName))
        } else {
          printf(filledName)
        }
      }
    }
    if (isPrint && col + 1 < cols) printf('\n')
  }
}
