import { countWords } from './countWords.ts'
import { FileInfo } from './file.ts'

export async function getFileListData() {
  let count = 0
  let maxLen = 0
  const fileList: Array<FileInfo> = []

  for await (const dirEntry of Deno.readDir('./')) {
    const fileLength = countWords(dirEntry.name)
    if (dirEntry.isDirectory) {
      fileList.push({
        name: dirEntry.name,
        type: 'dir',
        length: fileLength,
      })
    } else if (dirEntry.isSymlink) {
      fileList.push({
        name: dirEntry.name,
        type: 'symlink',
        length: fileLength,
      })
    } else {
      fileList.push({
        name: dirEntry.name,
        type: 'file',
        length: fileLength,
      })
    }
    if (maxLen < fileLength) {
      maxLen = fileLength
    }
    count++
  }
  return JSON.stringify({
    count: count,
    maxLen: maxLen,
    list: fileList,
  })
}
