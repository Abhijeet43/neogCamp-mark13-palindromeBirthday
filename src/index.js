const dateOfBirthEl = document.querySelector("#date-of-birth");
const showBtn = document.querySelector("#btn-show");
const outputEl = document.querySelector("#output");

function reverseString(str) {
  return str.split("").reverse().join("");
}

function checkPalindrome(str) {
  return str === reverseString(str);
}

function convertDateToString(date) {
  const dateStr = {
    day: "",
    month: "",
    year: ""
  };

  if (date.day < 10) {
    dateStr.day = "0" + date.day;
  } else {
    dateStr.day = date.day.toString();
  }

  if (date.month < 10) {
    dateStr.month = "0" + date.month;
  } else {
    dateStr.month = date.month.toString();
  }

  dateStr.year = date.year.toString();

  return dateStr;
}

function getAllDateFormats(date) {
  const dateStr = convertDateToString(date);

  const ddmmyyyy = dateStr.day + dateStr.month + dateStr.year;
  const mmddyyyy = dateStr.month + dateStr.day + dateStr.year;
  const yyyymmdd = dateStr.year + dateStr.month + dateStr.day;
  const ddmmyy = dateStr.day + dateStr.month + dateStr.year.slice(-2);
  const mmddyy = dateStr.month + dateStr.day + dateStr.year.slice(-2);
  const yymmdd = dateStr.year.slice(-2) + dateStr.month + dateStr.day;

  return [ddmmyyyy, mmddyyyy, yyyymmdd, ddmmyy, mmddyy, yymmdd];
}

function checkPalindromeForAllDateFormats(date) {
  const dateFormats = getAllDateFormats(date);
  let flag = false;

  for (let i = 0; i < dateFormats.length; i++) {
    if (checkPalindrome(dateFormats[i])) {
      flag = true;
      break;
    }
  }
  return flag;
}

function isLeapYear(year) {
  if (year % 400 === 0) return true;

  if (year % 100 === 0) return false;

  if (year % 4 === 0) return true;

  return false;
}

function getNextDate(date) {
  let day = date.day + 1;
  let month = date.month;
  let year = date.year;

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 2) {
    if (isLeapYear(year)) {
      if (day > 29) {
        day = 1;
        month++;
      } else {
        if (day > 28) {
          day = 1;
          month++;
        }
      }
    }
  } else {
    if (day > daysInMonth[month - 1]) {
      day = 1;
      month++;
    }
  }

  if (month > 12) {
    month = 1;
    year++;
  }

  return { day, month, year };
}

function getNextPalindromeDate(date) {
  let ctr = 0;
  let nextDate = getNextDate(date);

  while (1) {
    ctr++;
    const isPalindrome = checkPalindromeForAllDateFormats(nextDate);
    if (isPalindrome) {
      break;
    }
    nextDate = getNextDate(nextDate);
  }

  return [ctr, nextDate];
}

function getPreviousDate(date) {
  let day = date.day - 1;
  let month = date.month;
  let year = date.year;

  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (month === 3) {
    if (isLeapYear(year)) {
      if (day < 1) {
        day = 29;
        month--;
      }
    } else {
      if (day < 1) {
        day = 28;
        month--;
      }
    }
  } else if (month === 1) {
    if (day < 1) {
      day = 31;
      month = 12;
      year--;
    }
  } else if (day <= 1) {
    day = daysInMonth[month - 2];
    month--;
  }
  return { day, month, year };
}

function getPreviousPalindromeDate(date) {
  let ctr = 0;
  let previousDate = getPreviousDate(date);

  while (1) {
    ctr++;
    const isPalindrome = checkPalindromeForAllDateFormats(previousDate);
    if (isPalindrome) {
      break;
    }
    previousDate = getPreviousDate(previousDate);
  }
  return [ctr, previousDate];
}

function focus() {
  dateOfBirthEl.focus();
}

function showMessage(msg, err = false) {
  if (err) {
    outputEl.style.color = "red";
    setTimeout(() => {
      outputEl.innerText = "";
      outputEl.style.color = "white";
    }, 2000);
  }
  outputEl.innerText = msg;
  focus();
}

function givePalindrome() {
  const dateOfBirth = dateOfBirthEl.value;
  if (dateOfBirth) {
    const dateOfBirthStr = dateOfBirth.split("-");
    const date = {
      day: Number(dateOfBirthStr[2]),
      month: Number(dateOfBirthStr[1]),
      year: Number(dateOfBirthStr[0])
    };

    const isPalindrome = checkPalindromeForAllDateFormats(date);

    setTimeout(() => {
      if (isPalindrome) {
        outputEl.innerText = `Wow! Your Birthday is a Palindrome! 🥳`;
      } else {
        const [countNext, nextDate] = getNextPalindromeDate(date);
        const [countPrev, prevDate] = getPreviousPalindromeDate(date);
        if (countNext > countPrev) {
          showMessage(
            `Aww! Your birthday is not a palindrome.The nearest palindrome date is ${
              prevDate.day
            }-${prevDate.month}-${
              prevDate.year
            }. You missed it by ${countPrev} ${
              countPrev > 1 ? "days" : "day"
            }. 🙁`
          );
        } else {
          showMessage(
            `Aww! Your birthday is not a palindrome. The nearest palindrome date is ${
              nextDate.day
            }-${nextDate.month}-${
              nextDate.year
            }. You missed it by ${countNext} ${
              countNext > 1 ? "days" : "day"
            }. 🙁`
          );
        }
      }
    }, 1000);
  } else {
    showMessage("Date Input cannot be empty", true);
  }
}

showBtn.addEventListener("click", givePalindrome);
