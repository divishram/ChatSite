"use strict";

/**
 * Search query string and extract name from URL
 * @param {String} url
 * @returns {String} The name entered in the form
 */
function getNameFromURL(url) {
  let urlParams = new URL(url);
  let extractedName = urlParams.searchParams.get("username");
  return extractedName;
}

/**
 * When a user disconnects from site, it must remove then from the array
 * @param {Array} arrayOfUsers
 * @param {String} username
 * @returns {Array} Updated list of users
 */
function removeUser(arrayOfUsers, username) {
  let index = arrayOfUsers.indexOf(username);
  if (index > -1) {
    arrayOfUsers.splice(index, 1);
  }
  return arrayOfUsers;
}

module.exports = { getNameFromURL, removeUser };
