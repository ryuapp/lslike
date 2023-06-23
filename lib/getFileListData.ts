import { countWords } from './countWords.ts'
import { FileInfo } from './file.ts'

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
