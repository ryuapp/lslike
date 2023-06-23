import { FileInfo } from './file.ts'
import { printFileName } from './printFileName.ts'

export function printFileList(fileList: Array<FileInfo>) {
  fileList.forEach((file) => {
    printFileName(file.name, file.type)
  })
}
