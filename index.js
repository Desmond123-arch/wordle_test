let tries = 0;
let done = false;
let correctWord;


async function getRandomWord() {
    try {
        const response = await fetch("https://random-word-api.herokuapp.com/word?number=1&length=5");
        const words = await response.json();
        return words[0].toUpperCase()
    } catch(err) {
        throw err;
    }
}

$(document).ready(async() => {
    correctWord =  await getRandomWord();
    console.log(correctWord)
});
function generateRound(tries) {
    const div = document.createElement("div");
    div.className = "word";
    div.id = `word-${tries}`;

    for (let i = 1; i <= 5; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.setAttribute("aria-label", "word");
        input.id = `letter${i}`;
        div.appendChild(input);
    }
    $('.word-container').append(div);
    addListeners(tries);
}

function addListeners(tries) {
    $(`#word-${tries} input`).each((idx, element) => {
        element.addEventListener('input', (e) => {
            if (element.value.length > 1 || !lettersRegex.test(element.value)) {
                element.value = element.value.slice(0, element.value.length - 1);
            } else if (idx < 4) {
                element.nextElementSibling.focus()
            }
        });

        element.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && idx < 5) {
                e.preventDefault();
                element.value = element.value.slice(0, element.value.length - 1);
                element.previousElementSibling.focus();
            }
        })
    })
}

const lettersRegex = /[A-Za-z]/
const wordsInputs = ['.letter1', '.letter2', '.letter3', '.letter4', '.letter5']

$(`#word-${tries} input`).each((idx, element) => {
    element.addEventListener('input', (e) => {
        if (element.value.length > 1 || !lettersRegex.test(element.value)) {
            element.value = element.value.slice(0, element.value.length - 1);
        } else if (idx < 4) {
            element.nextElementSibling.focus()
        }
    });

    element.addEventListener('keydown', (e) => {
        if (e.key === "Backspace" && idx < 5) {
            e.preventDefault();
            element.value = element.value.slice(0, element.value.length - 1);
            element.previousElementSibling.focus();
        }
    })
})

$(".submit-btn").on("click", () => {
    console.log(correctWord)
    let inputWord = '';
    $(`#word-${tries} input`).each(function (idx, element) {
        console.log("Value")
        if (element.value.length === 0) {
            return false;
        } else {
            inputWord += element.value;
            if (element.value.toUpperCase() === correctWord[idx]) {
                console.log()
                $(element).css("backgroundColor", "green");
                $(element).css("color", "white");
                element.disabled = true
                done = true
            } else if (correctWord.includes(element.value.toUpperCase()) && new Set(inputWord).size === inputWord.length) {
                $(this).css("backgroundColor", "yellow");
                $(this).css("color", "white");
                element.disabled = true;
                done = false
            } else {
                done = false
                $(this).css("backgroundColor", "gray");
            }
        }
    })
    tries += 1;
    if (tries < 5 && !done) {
        generateRound(tries)
    } else {
        $(".submit-btn").disabled = true;
    }
})