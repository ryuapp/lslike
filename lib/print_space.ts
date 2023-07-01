import { printf } from '../deps.ts'

export function printSpace(length: number) {
  for (let i = 0; i < length; i++) printf(' ')
}
