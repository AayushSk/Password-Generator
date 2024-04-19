const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`@!#$%^&*() _-=+{[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// upperCaseCheck.checked = true; 
handleSlider();
// Set Strength Color to Grey
setIndicator("#ccc");

// Set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    
    let max = inputSlider.max;
    let min = inputSlider.min;
    inputSlider.style.backgroundSize = ( (passwordLength-min)*100/(max-min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber(){
    return getRndInteger(0, 9); 
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97, 123)); 
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65, 91)); 
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (upperCaseCheck.checked) hasUpper = true; 
    if (lowerCaseCheck.checked) hasLower = true; 
    if (numbersCheck.checked) hasNum = true; 
    if (symbolsCheck.checked) hasSym = true; 

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 0) {
        setIndicator("#0f0");
    } 
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // To make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    // Special Condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
} );

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
});


generateBtn.addEventListener('click', () => {
    // None of the checkbox are selected
    if(checkCount <=  0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider;
    }

    // let's start the journey to find the new password
    console.log("Starting the journey...");

    // remove old password
    password = "";

    // let's put the stuff mentoned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUppercaseCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generatelowercaseCase();
    // } 
    // if(numbersCheck.checked){
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upperCaseCheck.checked)
    funcArr.push(generateUpperCase);

    if(lowerCaseCheck.checked)
    funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

    // compulsory addition
    for(let i = 0; i <funcArr.length; i++){
        password += funcArr[i]();
    }
    console.log("Compulsory addition done");
    
    // remaining addition
    for(let i = 0; i <passwordLength-funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();    
    }
    console.log("Remaining addition done");
    
    
    // shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    
    // show in UI
    passwordDisplay.value = password;
    console.log("UI show done");

    // calculate strength
    calcStrength();
});

