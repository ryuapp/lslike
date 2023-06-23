import { FileInfo } from './file.ts'

export function getFileListLength(fileList: Array<FileInfo>) {
  let len = 0
  fileList.forEach((file) => len += file.length)

  return len
}
