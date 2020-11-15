//Capitalize the first letter of a string
export function ucFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//Takes in a string and convert it to __ 's
export function userHeaderFormat(string) {
  return string.charAt(0).toUpperCase() + string.slice(1) + "' s";
}

//Converts a string to an array of integers
export function stringToArrayInt(string) {
  return string.split(",").map((x) => +x);
}

//Helper function to calculate the most repeating string -> Returns an array
export function mostFreqStr(arr) {
  var obj = {},
    mostFreq = 0,
    which = [];
  arr.forEach((ea) => {
    if (!obj[ea]) {
      obj[ea] = 1;
    } else {
      obj[ea]++;
    }

    if (obj[ea] > mostFreq) {
      mostFreq = obj[ea];
      which = [ea];
    } else if (obj[ea] === mostFreq) {
      which.push(ea);
    }
  });

  return which;
}
