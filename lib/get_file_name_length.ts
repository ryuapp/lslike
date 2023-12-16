export const getFileNameLength = (str: string) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    str[i].match(/[ -~]/) ? (len += 1) : (len += 2);
  }
  return len;
};
