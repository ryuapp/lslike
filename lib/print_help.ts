import { printf } from './../deps.ts'
import { printSpace } from './print_space.ts'

const options = [
    {"shortName": "1","longName": "", "description": "list one file per line."},
    {"shortName": "","longName": "help", "description": "display this help and exit."}
]

export function printHelp(){
    const shortNameLength = 4
    const longNameLength = 14

    printf("Usage: ls [OPTION]\n")
    printf("List information about files in current directory.\n\n")
    printf("Options\n")
    options.forEach(option => {
        printSpace(2)
        if(option.shortName){
            printf("-" + option.shortName)
            option.longName? printf(","): printSpace(1)
            printSpace(1)
        }else printSpace(shortNameLength)

        if(option.longName){
            printf("--" + option.longName)
            printSpace(longNameLength - 2 - option.longName.length)
        }else printSpace(longNameLength)

        printf(option.description + "\n")
    });
}