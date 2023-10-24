var titleLinkMap;
var selectContainer = document.getElementById("select-container")
var commandContainer = document.getElementById("command-container")

fetch('https://anikettrivedi.github.io/code/assets/commands.json')
    .then((response) => response.json())
    .then((json) => {
        titleLinkMap = json;
    })
    .then(()=> {
        // create a drop down
        insertSelect()
        
        // insert selected section only
        insertSelectedSection()
    });

function insertSelect(){
    let select = document.createElement("select")
    select.setAttribute("name", "command-type")
    select.setAttribute("id", "select-command-type")
    select.onchange = insertSelectedSection
    selectContainer.appendChild(select)

    titleLinkMap.forEach(
        (i) => {
            let option = document.createElement("option")
            option.setAttribute("value", i.title)
            option.appendChild(document.createTextNode(i.title))
            select.appendChild(option)
        }
    )
}

function insertSelectedSection(){
    // get selected section
    let selectedSection = document.getElementById("select-command-type").value
    console.log(selectedSection)
    titleLinkMap.forEach(i => {
        if (i.title === selectedSection){
            fetchSectionContentsAndAdd(i)
        }
    });
}

function fetchSectionContentsAndAdd(i){    
    fetch(i.link)
        .then((response) => response.text())
        .then((content) => {
            // create container contents
            commandContainer.innerHTML = ""

            // add title
            let h3 = document.createElement("h3")
            h3.appendChild(document.createTextNode(i.title))
            commandContainer.appendChild(h3)
    
            // add contents
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

