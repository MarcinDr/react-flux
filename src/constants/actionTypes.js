"use strict";

//key mirror automatically copies key of key value pair to its value so we dont have to do this
var keyMirror = require('react/lib/keyMirror');

module.exports = keyMirror({
    CREATE_AUTHOR: null,
    INITIALIZE: null,
    UPDATE_AUTHOR: null,
    DELETE_AUTHOR: null
});