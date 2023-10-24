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
    titleLinkMap.forEach(i => {
        fetchSectionContentsAndAdd(i)
    });
}

function fetchSectionContentsAndAdd(i){
    var commandContainer = document.getElementById("command-container")
    var h3 = document.createElement("h3")
    h3.appendChild(document.createTextNode(i.title))
    commandContainer.appendChild(h3)
    
    var link = i.link
    fetch(link)
        .then((response) => response.text())
        .then((content) => {
            content.split("\n").forEach(
                (line) => {
                    // add sub heading for the section
                    if (line.startsWith("# ")){
                        let h4 = document.createElement("h4")
                        h4.appendChild(document.createTextNode(line.replace("# ", "")))
                        commandContainer.appendChild(h4)
                    } else if (line.startsWith("## ")){
                        let para = document.createElement("p")
                        para.appendChild(document.createTextNode(line.replace("## ", "")))
                        commandContainer.appendChild(para)
                    }
                }
            )
        })
}

