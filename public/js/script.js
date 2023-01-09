"use strict";

window.onload = pageReady;

function pageReady() {
  const form = document.forms[0];
  const messageContainer =
    document.getElementsByClassName("message-container")[0];
  const clearButton = document.getElementsByClassName("clear")[0];
  const inputBox = document.getElementsByClassName("input")[0];
  const nameOfUserOnPage = usernameFromUrl();
  const socket = io();

  socket.on("user joined", (username) => {
    appendUserJoinedToDom(username);
  });

  socket.on("message", (message) => {
    appendMessageToDom(message["msg"], message["username"]);
  });

  socket.on("user left", (username) => {
    appendUserLeftMessage(username);
    // Get list of delete buttons and add listener if user wants to delete the message
    let deleteButtons = document.getElementsByClassName("delete");
    let deleteButtonsLength = deleteButtons.length;

    for (let i = 0; i < deleteButtonsLength; i++) {
      deleteButtons[i].addEventListener("click", removeButton);
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent form from submitting
    let enteredMsg = e.target.elements[0].value;
    let currentUser = usernameFromUrl();
    appendMessageToDom(enteredMsg, currentUser);
    socket.emit("chat message", enteredMsg);
    e.target.elements[0].value = ""; // clear text
    e.target.elements[0].focus(); // focus on input
  });

  clearButton.addEventListener("click", () => {
    inputBox.value = ""; // clear entered text
  });

  /**
   * Returns current time in h:mm:ss a Format
   * @returns {string} Time message was sent
   */
  function currentTime() {
    let date = new Date();
    let time = date.toLocaleTimeString();
    return time;
  }

  /**
   * Outputs the entered msg into the DOM
   * @param {string} msg
   * @returns {undefined} Just appends the DOM, doesn't return anything
   */
  function appendMessageToDom(msg, username) {
    // Green msg if you sent it. Blue msg if other user
    let colourOfMsg = nameOfUserOnPage === username ? "primary" : "link"; // bulma colours
    let div = document.createElement("div");
    let getTime = currentTime();
    //append message to message container
    let outputMessage = `
                <article class="message is-${colourOfMsg} mt-3">
                <div class="message-header">
                  <p>${username}</p>
                  <p>${getTime}</p>
                </div>
                <div class="message-body">
                  ${msg}
                </div>
              </article>
                `;
    div.innerHTML = outputMessage;
    messageContainer.appendChild(div);
    // scroll to bottom of page when more messages are entered
    window.scrollTo(0, document.body.scrollHeight);
  }

  /**
   * Black text that says new user joined chat
   * @param {String} username
   * @returns {undefined}
   */
  function appendUserJoinedToDom(username) {
    let div = document.createElement("div");
    let outputMessage = `<div class="block">
      <p class="mt-2 mb-2"><strong>${username}</strong> has joined the chat</p>
    </div>
    `;
    div.innerHTML = outputMessage;
    messageContainer.appendChild(div);
  }

  /**
   * Red msg box indicating which user left
   * @param {String} username
   * @returns {undefined}
   */
  function appendUserLeftMessage(username) {
    let div = document.createElement("div");
    let getTime = currentTime();
    let outputMessage = `<article class="message is-danger mt-3 mb-3">
      <div class="message-header">
        <p>${username} has left at ${getTime}</p>
        <button class="delete" aria-label="delete"></button>
      </div>
    </article>
    `;
    div.innerHTML = outputMessage;
    messageContainer.appendChild(div);
  }

  /**
   * Search document URL and extract name from string
   * @returns {String}  User name
   */
  function usernameFromUrl() {
    let urlParams = new URL(document.URL);
    let extractedName = urlParams.searchParams.get("username");
    return extractedName;
  }

  /**
   * When user leave shows msg box and other users can delete it
   * @returns {undefined}
   */
  function removeButton() {
    this.parentElement.parentElement.remove();
  }
}
