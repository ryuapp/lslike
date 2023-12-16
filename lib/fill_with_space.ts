import { FileInfo } from "./types.ts";

export const fillWithSpace = (file: FileInfo, len: number) => {
  for (let i = file.length; i <= len; i++) {
    file.name += " ";
  }
  return file.name;
};
