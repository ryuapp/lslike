import { printf } from './deps.ts'
import { FileInfo } from './lib/file_info_type.ts'
import { fillWithSpace } from './lib/fill_with_space.ts'
import { getFileListData } from './lib/get_file_list_data.ts'
import { getFileTableData } from './lib/get_file_table_data.ts'
import { printFileList } from './lib/print_file_list.ts'
import { printFileName } from './lib/print_file_name.ts'

export async function lslike(args = {}) {
  const fileListData = await getFileListData().then((c) => JSON.parse(c))
  const fileList = fileListData.list
  const fileListLength = fileListData.len
  const fileListCount = fileListData.count

  const consoleSize = Deno.consoleSize()
  const consoleWidth = consoleSize.columns

  // Display one file per column.
  if (args['1']) {
    printFileList(fileList, 1)
    return
  }
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
  let endCols = fileListData.count - cols * rows
  if (endCols > cols) {
    cols += 1
    rows = Math.floor(fileListData.count / cols)
    endCols = fileListData.count - cols * rows
  }

  const { maxLength, fileTable }: {
    maxLength: Array<number>
    fileTable: FileInfo[][]
  } = getFileTableData(
    fileList,
    fileListCount,
    rows,
    cols,
  )
  /*
  console.log(fileList)
  console.log(fileListData.maxLen)
  console.log(
    `ファイル数:${fileListData.count} 行:${cols} 列:${rows} 最後の行:${endCols}`,
  )
  console.log(consoleWidth)
  console.log(fileListLength + fileList.length)*/

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
