import { FileInfo } from './file_info_type.ts'

export function getFileTableData(
  fileList: Array<FileInfo>,
  fileCount: number,
  rows: number,
  cols: number,
) {
  const endCols = fileCount - cols * rows
  const maxLength: Array<number> = []
  const fileTable: FileInfo[][] = []
  let line: Array<FileInfo> = []
  let endLength = 0

  for (let row = 0; row < rows; ++row) {
    line = []
    for (let col = 0; col < cols; ++col) {
      const file: FileInfo = fileList.shift()!

      line.push(file)
      if (isNaN(maxLength[row]) || maxLength[row] < file.length) {
        maxLength[row] = file.length
      }
    }
    fileTable.push(line)
  }

  if (endCols !== 0) {
    line = []
    fileList.forEach((file: FileInfo) => {
      line.push(file)
      if (file.length > endLength) {
        endLength = file.length
      }
    })
    fileTable.push(line)
  }

  return { maxLength, fileTable }
}
