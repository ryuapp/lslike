import { getFileNameLength } from "./get_file_name_length.ts";
import { FileInfo } from "./types.ts";

export async function getFileListData() {
  let count = 0;
  let len = 0;
  let maxLen = 0;
  const fileList: Array<FileInfo> = [];

  for await (const dirEntry of Deno.readDir("./")) {
    const fileLength = getFileNameLength(dirEntry.name);
    let type = "file";
    if (dirEntry.isDirectory) {
      type = "dir";
    } else if (dirEntry.isSymlink) {
      type = "symlink";
    }

    fileList.push({
      name: dirEntry.name,
      type: type,
      length: fileLength,
    });

    if (maxLen < fileLength) {
      maxLen = fileLength;
    }
    count++;
    len += fileLength;
  }
  return JSON.stringify({
    count: count,
    len: len,
    maxLen: maxLen,
    list: fileList,
  });
}
