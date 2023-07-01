import { FileInfo } from './file_info_type.ts'
import { printFileName } from './print_file_name.ts'

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
