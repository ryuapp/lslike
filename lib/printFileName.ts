import { brightBlue, brightCyan, printf } from '../deps.ts'

export function printFileName(name: string, type: string) {
  if (type === 'dir') {
    printf(brightBlue(name))
  } else if (type === 'symlink') {
    printf(brightCyan(name))
  } else {
    printf(name)
  }
  printf(' ')
}
