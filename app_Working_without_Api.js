//-----------------------------------Selecting HTML elements-----------------------------
const user_input = document.querySelector("#user_input");
const phrase = document.querySelector(".phrase");
const pass = document.querySelector("#pass");
const cursor = document.querySelector('.cursor');

//time elements
const outputSeconds = document.querySelector('#second');
const outputTens = document.querySelector('#ten');

//WPM and CPM

const wpm = document.querySelector('#wpm');
const cpm = document.querySelector('#cpm');

//char_index keeps cnt of which index of the phrase is currently on
var char_index = 0;

//RANDOM FAMOUS QUOTE API
const loadQuotes = async () => {
    try{
        const res = await axios.get("https://type.fit/api/quotes");
        // phrase.innerHTML = res.data[3].text;
        return res.data
        // console.log(phrase.innerHTML);
    } catch(e){
        console.log("ERROR", e);
    }
};
loadQuotes(phrase);


// phrase.innerHTML = getQuote();
// console.log(quote);

//Variable for initial length of phrase
var phrase_length = phrase.innerHTML.length;
//phrase_copy is used in place of og phrase as og phase will change
var phrase_copy = phrase.innerHTML;
var start = false;

var seconds = 0;
var tens = 0;
var minutes = 0;

var char_right = 0;
var char_wrong = 0;
var interval



//Creates an array that stores all the words in order
words = phrase.innerHTML.split(" ");
var word_cnt = 0;

//Wrap every character with a span,
//Split string into individual components, map creates an array that wraps each element
//with a span, join converts array back into string, without space separation
//Finally, replace old phrase with new spanned version
//This allows individual characters to be styled using CSS
phrase.innerHTML = phrase.innerHTML
    .split("")
    .map(function (letter, index) {
        return '<span id="char-' + index + '">' + letter + "</span>";
    })
    .join("");


//Create object to store the HTML selected span elements with corresponding id
//This is a good way to create incrementing variable names
var span_arr = {};
for (let i = 0; i < phrase_length; i++) {
    span_arr["#char-" + i] = document.querySelector("#char-" + i);
}

function blink_cursor(add_del, char_index) {
    if (char_index > 0 && char_index < phrase_length && add_del == "add") {
        span_arr[`#char-${char_index}`].classList.add("textCursor");
        span_arr[`#char-${char_index - 1}`].classList.remove("textCursor");

    } else if (char_index > 0 && char_index < phrase_length && add_del == "del") {
        span_arr[`#char-${char_index}`].classList.remove("textCursor");
        span_arr[`#char-${char_index - 1}`].classList.add("textCursor");

    } else if (char_index >= phrase_length){
        char_index -= 1;
        span_arr[`#char-${char_index }`].classList.remove("textCursor");
    }


    if (char_index == 0 && add_del == 'add'){
        span_arr[`#char-${0}`].classList.add("blinkCursor");
    }else{
        span_arr[`#char-${0}`].classList.remove("blinkCursor");
    }
}


//----------------------------------Keyboard Event Listener-----------------------------
document.addEventListener("keydown", function (e) {

    if (char_index >= 0 && char_index < phrase_length && e.key.length == 1) {
        if (start == false){
            //timer starts
            cursor.classList.remove('on');
            start = true;
            
            clearInterval(interval);
            tens = 0;
            seconds = 0;
            interval = setInterval(startTime, 10);              //increment 10ms following the startTime function
        }
        span_arr[`#char-${char_index}`].innerHTML = phrase_copy[char_index];


        //Add button pressed into the text field to be compared with main
        user_input.innerHTML = user_input.innerHTML + e.key;

        //Check if key press is same as paragraph
        if (e.key === phrase_copy[char_index]) {
            //Changes the span of the key pressed style
            span_arr["#char-" + char_index].style.color = "#ffffff"; //white
            //keep cnt of 
            char_right += 1;

        } else if (e.key !== phrase_copy[char_index]) {
            //If wrong and not backspace
            span_arr["#char-" + char_index].style.color = "#B3FFAE"; //orange
            span_arr["#char-" + char_index].innerHTML = e.key;
            
            char_wrong += 1;
        }
        
        char_index += 1;
        blink_cursor("add", char_index);




        //---------------If timer is done or user enters everything correctly--------------------------------------------------------------------------
        if (user_input.innerHTML == phrase_copy) {
            clearInterval(interval);

            cursor.classList.add('on');

            start = false;
            blink_cursor("del", char_index);
            result = user_input.innerHTML.split(" ")
            for(let i = 0; i < words.length; i++){
                if (result[i] == words[i]) word_cnt++;
            }
        }
        //----------------------------------------------------------------------------------------------------------------------------------------------





    } else if (char_index >= phrase_length && e.key.length == 1) {
        
        // char_index += 1;
        blink_cursor("add", char_index);

//----------------------------------DELETING CHARACTERS-------------------------------------
    } else if (e.key == "Backspace" && char_index > 0 && char_index <= phrase_length) {
        if(char_index > 0 ){
            blink_cursor("del", char_index);
        }else{
            blink_cursor("idle", char_index);
        }


        //remove the last character from the string
        user_input.innerHTML = user_input.innerHTML.slice(0, -1);


        char_index -= 1;
        span_arr["#char-" + char_index].style.color = "rgba(255, 255, 255, 0.5)"; //blue
        span_arr["#char-" + char_index].innerHTML = phrase_copy[char_index];


    } else if (e.key == "Backspace" && char_index > phrase_length) {
        if(char_index > 0 ){
            blink_cursor("del", char_index);
        }else{
            blink_cursor("idle", char_index);
        }

        user_input.innerHTML = user_input.innerHTML.slice(0, -1);
        char_index -= 1;
    }

});
user_input.addEventListener("click", function (e) {
    if (start == false){
        blink_cursor("add", 0);
    }
});

//----------------------------------Cursor Event Listener-------------------------------------------
document.addEventListener('mousemove', (e) =>{
    let x = e.pageX;
    let y = e.pageY;

    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
});

//---------------------------------Logic for displaying time----------------------------------------
function startTime(){
    tens++;
    if (tens <= 9){
        outputTens.innerHTML = '0' + tens;
    } else if (tens > 9 && tens <= 99){

        if (tens == 10){
            //Math for WPM and CPM

            //USE LENGTH OF typed characters instead
            cpm.innerHTML = Math.round((user_input.innerHTML.length * 1200/((seconds == 0) ? tens : tens*seconds)).toString());                  //character per minute
            wpm.innerHTML = Math.round((parseInt(cpm.innerHTML)/5));    
        }
        outputTens.innerHTML = tens;
    } else {
        seconds++;
        outputSeconds.innerHTML = '0' + seconds;
        tens = 0;
        outputTens.innerHTML = '00';
    }

    if (seconds > 9){
        outputSeconds.innerHTML = seconds;
        if (seconds == 60){
            clearInterval(interval);

            cursor.classList.add('on');

            start = false;
            blink_cursor("del", char_index);
            result = user_input.innerHTML.split(" ")
            for(let i = 0; i < words.length; i++){
                if (result[i] == words[i]) word_cnt++;
            }
        }
    }
    minutes = seconds/ 60;
    console.log(minutes);
}
