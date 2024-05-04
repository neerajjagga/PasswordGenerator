const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthvalue]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-dataIndicator]");
const generateBtn = document.querySelector("#generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%&*(])?/<>:}["->{';
const strengthColor = document.querySelector('#strength-indicator');

let password = "";
let passwordLength = 10;
let checkCount = 0;
// set strength bydefault circle to grey
handleSlider();

// set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = color;
}

function getRndIntegers(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber() {
    return getRndIntegers(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndIntegers(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndIntegers(65, 91));
}

function generateSymbol() {
    const randNum = getRndIntegers(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper || hasLower && (hasNum || hasSym) && hasSym && password.length >= 8) {
        strengthColor.style.backgroundColor = "rgb(16, 221, 16)";
        strengthColor.style.boxShadow = "1px 1px 30px rgb(16, 221, 16)";
    } else if ((hasUpper || hasLower) && (hasNum || hasSym) || hasUpper && hasLower && password.length >= 6) {
        strengthColor.style.backgroundColor = "yellow";
        strengthColor.style.boxShadow = "1px 1px 30px yellow";
    } else {
        strengthColor.style.backgroundColor = "red";
        strengthColor.style.boxShadow = "1px 1px 30px red";
    }
}

async function copyPassword() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch (e) {
        copyMsg.innerText = "";
    }
    // to make copy text visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
}); 

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyPassword();
    }
});

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });
    // special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    } 
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

function shufflePassword(array){
    // fisher yates method
    for(let i=array.length -1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = '';
    array.forEach((el) => (str += el));
    return str;

}

generateBtn.addEventListener('click', () => {
    // null of the checkbox are selected
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    
    //  remove old password
    password = "";

    // lets put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // } 
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // } 
    // if(numbersCheck.checked){
    //     password += generateRndNumber();
    // } 
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // } 

    let funcArr = [];

    if (uppercaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRndNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    //  compulsary addition

    for(let i=0; i<funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition

    for(let i=0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndIntegers(0,funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password

    password = shufflePassword(Array.from(password));
    
    // show in UI
    passwordDisplay.value = password;
    
    // calculate strength
    calcStrength();

});

