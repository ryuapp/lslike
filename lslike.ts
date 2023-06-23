import { printf } from './deps.ts'
import { FileInfo } from './lib/file.ts'
import { fillWithSpace } from './lib/fillWithSpace.ts'
import { getFileListData } from './lib/getFileListData.ts'
import { printFileList } from './lib/printFileList.ts'
import { printFileName } from './lib/printFileName.ts'

export async function lslike() {
  const fileListData = await getFileListData().then((c) => JSON.parse(c))
  const fileList = fileListData.list
  const fileListLength = fileListData.len
  const fileListCount = fileListData.count

  const consoleSize = Deno.consoleSize()
  const consoleWidth = consoleSize.columns

  // Display files if it fits within one line.
  if (consoleWidth > (fileListLength + fileListCount)) {
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
