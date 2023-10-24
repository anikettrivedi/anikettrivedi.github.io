var commandsJson;

fetch('https://anikettrivedi.github.io/code/assets/commands.json')
    .then((response) => response.json())
    .then((json) => {
        commandsJson = json;
    })
    .then(()=> {
        insertCommands()
    });

function insertCommands(){
    commandsJson.forEach(element => {
        insertCommandSection(element)
    });
}

function insertCommandSection(element){
    var commandContainer = document.getElementById("command-container")
    var div = document.createElement("div")
    var h3 = document.createElement("h3")
    var title = document.createTextNode(element.title)
    var link = element.link
    h3.appendChild(title)
    div.appendChild(h3)
    commandContainer.appendChild(div)
}