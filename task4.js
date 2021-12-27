const { SHA3 } = require('sha3');
const crypto = require('crypto');
const process = require('process');
const readline = require('readline');
const readlineSync = require("readline-sync");

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var possibleMoves = process.argv.slice(2);

var n = possibleMoves.length;
var computerChoice = getRandomIntInclusive(1,n);

function rotateRight(arr){
  let last = arr.pop();
  arr.unshift(last);
  return arr;
}

function getResult(computer, user){
  uMove = possibleMoves[user -1];
  cMove = possibleMoves[computer -1];

  {
    while (possibleMoves.indexOf(uMove) != n/2 - 0.5) {
      possibleMoves = rotateRight(possibleMoves);
    }
    user = possibleMoves.indexOf(uMove);
    computer = possibleMoves.indexOf(cMove);
    if (user < computer) {
      process.stdout.write('Win'+' '.repeat(cellWidth-'Win'.length))
    }
    else if (user == computer) {
      process.stdout.write('Draw'+' '.repeat(cellWidth-'Draw'.length))
    }
    else {
      process.stdout.write('Lose'+' '.repeat(cellWidth-'Lose'.length))
    }
  }
}

const key = crypto.generateKeySync('hmac', { length: 256 });

function printKey()
{
  console.log('Generated key: ',key.export().toString('hex'));
}

function printMenu() {
  for (var i = 0; i < possibleMoves.length; i++) {
    console.log(i + 1,'-',possibleMoves[i]);
  }
  console.log('0 - Exit');
  console.log('? - Help')
  makeUserChoice();
}

if((process.argv.length >= 5) && (process.argv.length % 2 == 1))
{
  var cellWidth = possibleMoves.reduce(
    function (a, b) {
      return a.length > b.length ? a : b;
    }
  ).length + 1;

  cellWidth = cellWidth > 10 ? cellWidth : 10;
}
else {
  process.exit(console.log("You must write arguments in an odd number greater than or equal to 3."));
}

function printTable(a) {
  for (var i = 0; i < a.length; i++) {
    if (i == 0) {
      process.stdout.write(' '.repeat(cellWidth));
      for (var k = 0; k < a.length; k++) {
        process.stdout.write(a[k] + ' '.repeat(cellWidth-a[k].length));
      }
      process.stdout.write('\n');
    }
    process.stdout.write(a[i] + ' '.repeat(cellWidth-a[i].length));
    for (var j = 0; j < a.length; j++) {
      getResult(i+1,j+1);
    }
    process.stdout.write('\n');
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var userChoice;
function makeUserChoice() {
  var answer = readlineSync.question("Enter your choice: \n");
  if (answer >= 1 && answer <= possibleMoves.length)
  {
    userChoice = answer;
    console.log(userChoice);
  }
  else if (answer == '?') {
    printTable(possibleMoves);
    makeUserChoice();
  }
  else if (answer == 0) {
    process.exit(1);
  }
  else {
    console.log('Invalid choice')
    makeUserChoice();
  }
}

function getResultKey() {
  var resultKey = key.export().toString('hex') + computerChoice;
  var hash = new SHA3(256);
  hash.update(resultKey);
  console.log('Result key: ',hash.digest('hex'));
}

function printComputerChoice() {
  console.log('Computer move: ',computerChoice);
}

function printUserChoice() {
  console.log('User move: ',userChoice);
}

printMenu();
printComputerChoice();
printUserChoice();
getResult(computerChoice,userChoice);
process.stdout.write('\n');
printKey();
getResultKey();
