console.log("hello")
fetch('https://anikettrivedi.github.io/code/commands.json')
    .then((response) => response.json())
    .then((json) => console.log(json));