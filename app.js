//-----------------------------------Selecting HTML elements-----------------------------
const user_input = document.querySelector("#user_input");
const phrase = document.querySelector("#phrase");
const pass = document.querySelector("#pass");
const cursor = document.querySelector(".cursor");
const wrapper = document.querySelector("#text-wrapper");

//---------------------------------------time elements------------------------------------
const outputSeconds = document.querySelector("#second");
const outputTens = document.querySelector("#ten");

//------------------------------------------WPM and CPM-----------------------------------
const wpm = document.querySelector("#wpm");
const cpm = document.querySelector("#cpm");

//char_index keeps cnt of which index of the phrase is currently on
var char_index = 0;

var seconds = 0;
var tens = 0;
var minutes = 0;

var char_right = 0;
var char_wrong = 0;
var interval;

var start = false;

var quotes;

var phrase_length = 0;
var phrase_copy;
var word_cnt = 0;

var span_arr = {};

//------------------------------------RANDOM FAMOUS QUOTE API---------------------------------------
fetch("https://type.fit/api/quotes")
  .then(function (response) {
    //is first response received, convert to a readable json object
    return response.json();
  })
  .then(function (data) {
    //Perform this function when a response has been received
    //essentially turns into a synchronous code
    quotes = data;
    // loadQuotes(data);
  });

let loadQuotes = (quotes) => {
  phrase.innerHTML = quotes[Math.floor(Math.random() * quotes.length)].text;

  //Variable for initial length of phrase
  phrase_length = phrase.innerHTML.length;
  //phrase_copy is used in place of original phrase as original phase will change
  phrase_copy = phrase.innerHTML;

  //Creates an array that stores all the words in order
  words = phrase.innerHTML.split(" ");

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

  //Create array that stores the HTML selected span elements using corresponding id
  //  Side note: This is a good way to create incrementing variable names
  for (let i = 0; i < phrase_length; i++) {
    span_arr["#char-" + i] = document.querySelector("#char-" + i);
  }
};

function blink_cursor(add_del, char_index) {
  if (char_index > 0 && char_index < phrase_length && add_del == "add") {
    span_arr[`#char-${char_index}`].classList.add("textCursor", "blinkCursor");
    span_arr[`#char-${char_index - 1}`].classList.remove(
      "textCursor",
      "blinkCursor"
    );
  } else if (char_index > 0 && char_index < phrase_length && add_del == "del") {
    span_arr[`#char-${char_index}`].classList.remove(
      "textCursor",
      "blinkCursor"
    );
    span_arr[`#char-${char_index - 1}`].classList.add(
      "textCursor",
      "blinkCursor"
    );
  } else if (char_index >= phrase_length) {
    char_index -= 1;
    span_arr[`#char-${char_index}`].classList.remove(
      "textCursor",
      "blinkCursor"
    );
  }

  if (char_index == 0 && add_del == "add") {
    span_arr[`#char-${0}`].classList.add("blinkCursor");
  } else {
    span_arr[`#char-${0}`].classList.remove("blinkCursor");
  }
}

//----------------------------------Keyboard Event Listener-----------------------------
document.addEventListener("keydown", function (e) {
  if (char_index >= 0 && char_index < phrase_length && e.key.length == 1) {
    if (start == false) {
      //timer starts
      cursor.classList.remove("on");
      start = true;

      clearInterval(interval);
      tens = 0;
      seconds = 0;
      interval = setInterval(startTime, 10); //increment 10ms following the startTime function
      console.log(interval);
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

    if (char_index > 0)
      span_arr["#char-" + parseInt(char_index - 1)].innerHTML =
        phrase_copy[char_index - 1];

    char_index += 1;
    blink_cursor("add", char_index);

    //----------If timer is done or user enters everything correctly---------------
    if (user_input.innerHTML == phrase_copy || char_index == phrase_length) {
      clearInterval(interval);

      cursor.classList.add("on");
      char_wrong = 0;

      wrapper.style.transition = "transform 0.3s ease";
      wrapper.style.transform = "translate(0, -12px)";

      start = false;
      blink_cursor("del", char_index);
      result = user_input.innerHTML.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (result[i] == words[i]) word_cnt++;
      }
    }
  } else if (char_index >= phrase_length && e.key.length == 1) {
    blink_cursor("add", char_index);

    //----------------------------------DELETING CHARACTERS-------------------------------------
  } else if (
    e.key == "Backspace" &&
    char_index > 0 &&
    char_index <= phrase_length
  ) {
    if (char_index > 0) {
      blink_cursor("del", char_index);
    } else {
      blink_cursor("idle", char_index);
    }

    //remove the last character from the string
    user_input.innerHTML = user_input.innerHTML.slice(0, -1);

    char_index -= 1;
    span_arr["#char-" + char_index].style.color = "rgba(255, 255, 255, 0.5)"; //blue
    span_arr["#char-" + char_index].innerHTML = phrase_copy[char_index];
  } else if (e.key == "Backspace" && char_index > phrase_length) {
    if (char_index > 0) {
      blink_cursor("del", char_index);
    } else {
      blink_cursor("idle", char_index);
    }

    user_input.innerHTML = user_input.innerHTML.slice(0, -1);
    char_index -= 1;
  }
});

// ---------------------------------_Mouse Click--------------------------------------------------
phrase.addEventListener("click", function (e) {
  user_input.focus();

  char_wrong = 0;

  char_index = 0;
  clearInterval(interval);
  tens = 0;
  seconds = 0;
  start = false;

  // wrapper.style.transition = "transform 0.3s ease";
  // wrapper.style.transform = "translate(0, -12px)";

  outputTens.innerHTML = "00";
  outputSeconds.innerHTML = "00";
  user_input.innerHTML = "";

  cpm.innerHTML = "0";
  wpm.innerHTML = "0";

  loadQuotes(quotes);
  if (start == false) {
    blink_cursor("add", 0);
  }
});
wrapper.addEventListener("mouseleave", function (e) {
  wrapper.style.transition = "";
  wrapper.style.transform = "";
});
//----------------------------------Cursor Event Listener-------------------------------------------
document.addEventListener("mousemove", (e) => {
  let x = e.pageX;
  let y = e.pageY;

  cursor.style.left = x + "px";
  cursor.style.top = y + "px";
});

//---------------------------------Logic for displaying time----------------------------------------
function startTime() {
  tens++;
  if (tens <= 9) {
    outputTens.innerHTML = "0" + tens;
  } else if (tens > 9 && tens <= 99) {
    if (tens == 10) {
      //Math for WPM and CPM

      //USE LENGTH OF typed characters instead
      let calc_time = (seconds == 0 ? tens : tens * seconds) / 600;
      cpm.innerHTML = Math.round(
        (user_input.innerHTML.length / calc_time).toString()
      ); //character per minute
      let wpm_temp = parseInt(cpm.innerHTML) / 5;
      wpm.innerHTML = Math.round(
        wpm_temp -
          (char_wrong / calc_time > wpm_temp ? 0 : char_wrong / calc_time)
      );
    }
    outputTens.innerHTML = tens;
  } else {
    seconds++;
    outputSeconds.innerHTML = "0" + seconds;
    tens = 0;
    outputTens.innerHTML = "00";
  }

  if (seconds > 9) {
    outputSeconds.innerHTML = seconds;
    if (seconds == 60) {
      clearInterval(interval);

      cursor.classList.add("on");

      start = false;
      blink_cursor("del", char_index);
      result = user_input.innerHTML.split(" ");
      for (let i = 0; i < words.length; i++) {
        if (result[i] == words[i]) word_cnt++;
      }
    }
  }
  minutes = seconds / 60;
}
