var titleLinkMap;

fetch('https://anikettrivedi.github.io/code/assets/commands.json')
    .then((response) => response.json())
    .then((json) => {
        titleLinkMap = json;
    })
    .then(()=> {
        insertSections()
    });

function insertSections(){
    titleLinkMap.forEach(element => {
        insertSectionContent(element)
    });
}

function insertSectionContent(element){
    var commandContainer = document.getElementById("command-container")
    var title = document.createTextNode(element.title)
    var link = element.link
    
    fetch(link)
        .then((response) => response.text())
        .then(text => console.log(text))
}

