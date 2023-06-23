import { brightBlue, brightCyan, printf } from './deps.ts'

interface FileInfo {
  name: string
  type: string
  length: number
}

export const countWords = (str: string) => {
  let len = 0
  for (let i = 0; i < str.length; i++) {
    str[i].match(/[ -~]/) ? (len += 1) : (len += 2)
  }
  return len
}
export const fillWithSpace = (file: FileInfo, len: number) => {
  for (let i = file.length; i <= len; i++) {
    file.name += ' '
  }
  return file.name
}
export function getFileListLength(fileList: Array<FileInfo>) {
  let len = 0
  fileList.forEach((file) => len += file.length)

  return len
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
        length: countWords(dirEntry.name),
      })
    } else if (dirEntry.isSymlink) {
      fileList.push({
        name: dirEntry.name,
        type: 'symlink',
        length: countWords(dirEntry.name),
      })
    } else {
      fileList.push({
        name: dirEntry.name,
        type: 'file',
        length: countWords(dirEntry.name),
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
  printf(' ')
}
export function printFileList(fileList: Array<FileInfo>) {
  fileList.forEach((file) => {
    printFileName(file.name, file.type)
  })
}

export async function lslike() {
  const fileListData = await getFileListData().then((c) => JSON.parse(c))
  const fileList = fileListData.list
  const fileListLength = getFileListLength(fileList)
  
  const consoleSize = Deno.consoleSize()
  const consoleWidth = consoleSize.columns

  // Display files if it fits within one line.
  if (consoleWidth > (fileListLength + fileList.length)) {
    printFileList(fileList)
    return
  }

  let rows = Math.floor(consoleWidth / fileListData.maxLen)
  let cols = Math.floor(fileListData.count / rows)
  if (cols <= 1) {
    cols = 2
    rows = Math.floor(fileListData.count / cols)
  }
  const endCols = fileListData.count - cols * rows

  let line: Array<FileInfo> = []
  const fileTable: FileInfo[][] = []
  const maxLength: Array<number> = []
  /*console.log(fileList)
  console.log(fileListData.maxLen)
  console.log(
    `ファイル数:${fileListData.count} 行:${cols} 列:${rows} 最後の行:${endCols}`,
  )
  console.log(consoleWidth)
  console.log(fileListLength + fileList.length)*/

  for (let row = 0; row < rows; ++row) {
    line = []
    for (let col = 0; col < cols; ++col) {
      const file = fileList.shift()
      line.push(file)
      if (isNaN(maxLength[row]) || maxLength[row] < file.length) {
        maxLength[row] = file.length
      }
    }
    fileTable.push(line)
  }

  if (endCols !== 0) {
    line = []
    fileList.forEach((e: FileInfo) => {
      line.push(e)
    })
    fileTable.push(line)
  }
  let isPrint = false
  for (let col = 0; col < cols; ++col) {
    isPrint = false
    for (let row = 0; row <= rows; ++row) {
      if (row !== rows || col < endCols) {
        const file: FileInfo = fileTable[row][col]
        const filledName: string = fillWithSpace(file, maxLength[row])
        isPrint = true

        printFileName(filledName, file.type)
      }
    }
    if (isPrint && col + 1 < cols) printf('\n')
  }
}
