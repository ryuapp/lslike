import { FileInfo } from './file.ts'
import { printFileName } from './printFileName.ts'

export function printFileList(fileList: Array<FileInfo>, option = 0) {
  if (option === 1) {
    let count = 0
    fileList.forEach((file) => {
      if (count !== 0) console.log('')
      printFileName(file.name, file.type, false)
      count++
    })
    return
  }
  fileList.forEach((file) => {
    printFileName(file.name, file.type)
  })
}
