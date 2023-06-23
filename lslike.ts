import { brightBlue, brightCyan, printf } from './deps.ts'

interface FileInfo {
  name: string
  type: string
}

export const countWords = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    str[i].match(/[ -~]/) ? (len += 1) : (len += 2)
  }
  return len
}
export const fillWithSpace = (str: string, len: number) => {
  for (let i = countWords(str); i <= len; i++) {
    str += ' '
  }
  return str + ' '
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
  return JSON.stringify({
    count: count,
    maxLen: maxLen,
    list: fileList,
  })
}
export function printFileName(name, type) {
  if (type === 'dir') {
    printf(brightBlue(name))
  } else if (type === 'symlink') {
    printf(brightCyan(name))
  } else {
    printf(name)
  }
  printf('  ')
}
export function printFileList(fileList: Array<FileInfo>) {
  fileList.forEach((file) => {
    printFileName(file.name, file.type)
  })
}

export async function lslike() {
  const fileListData = await getFileListData().then((c) => JSON.parse(c))
  const fileList = fileListData.list
  const originFileList = fileList.concat()

  const consoleSize = Deno.consoleSize()
  const consoleWidth = consoleSize.columns
  const rows = Math.floor(consoleWidth / fileListData.maxLen)
  const cols = Math.floor(fileListData.count / rows)
  const endCols = fileListData.count - cols * rows

  let line: Array<FileInfo> = []
  const table: FileInfo[][] = []
  const maxLength: Array<number> = []
  /*console.log(fileList);
  console.log(fileListData.maxLen);
  console.log(
    `ファイル数:${fileListData.count} 行:${cols} 列:${rows} 最後の行:${endCols}`
  );*/

  if (cols === 0) {
    printFileList(fileList)
  } else {
    let maxCount = 0
    for (let row = 0; row < rows; ++row) {
      line = []
      for (let col = 0; col < cols; ++col) {
        const file = fileList.shift()
        line.push(file)
        if (isNaN(maxLength[row]) || maxLength[row] < countWords(file.name)) {
          maxLength[row] = countWords(file.name)
        }
        maxCount += countWords(file.name) + 2
      }
      table.push(line)
    }
    if (consoleWidth >= maxCount - 2) {
      printFileList(originFileList)
      return
    }

    if (endCols !== 0) {
      line = []
      fileList.forEach((e: FileInfo) => {
        line.push(e)
      })
      table.push(line)
    }
    let isPrint = false
    for (let col = 0; col < cols; ++col) {
      isPrint = false
      for (let row = 0; row <= rows; ++row) {
        if (row !== rows || col < endCols) {
          const file: FileInfo = table[row][col]
          const filledName: string = fillWithSpace(file.name, maxLength[row])
          isPrint = true

          printFileName(filledName, file.type)
        }
      }
      if (isPrint && col + 1 < cols) printf('\n')
    }
  }
}
