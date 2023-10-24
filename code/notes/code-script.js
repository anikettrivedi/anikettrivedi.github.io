var titleLinkMap;
var selectContainer = document.getElementById("select-container")
var cmdContainer = document.getElementById("cmd-container")

fetch('https://anikettrivedi.github.io/code/assets/cmd.json')
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
    select.setAttribute("name", "cmd-type")
    select.setAttribute("id", "select-cmd-type")
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
    let selectedSection = document.getElementById("select-cmd-type").value
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
            cmdContainer.innerHTML = ""

            // add title
            document.title = `${i.title} commands`
    
            // add contents
            let contents = content.split("\n")
            for (let j = 0; j < contents.length; j++){
                let line = contents[j]
                // add sub heading for the section
                if (line.startsWith("# ")){
                    let hr = document.createElement("hr")
                    let h3 = document.createElement("h3")
                    h3.appendChild(document.createTextNode(line.replace("# ", "")))
                    cmdContainer.appendChild(h3)
                    cmdContainer.appendChild(hr)
                } else if (line.startsWith("## ")){
                    // add command description
                    let cmdDescription = line.replace("## ", "")
                    let h4 = document.createElement("h4")
                    h4.appendChild(document.createTextNode(cmdDescription))
                    cmdContainer.appendChild(h4)
                } else if (line.startsWith("### ")){
                    // add commands
                    let cmdText = line.replace("### ", "")
                    addCmdTextPanel(cmdText)
                } else if (line.startsWith("###~")){
                    let multilineCmd = ""
                    let rowCount = 0
                    j++
                    while (contents[j] !== "~###"){
                        multilineCmd += contents[j] + "\n"
                        j++
                        rowCount++
                    }
                    addMultilineCmdTextAreaPanel(multilineCmd, rowCount)
                }
            }
        })

        function addCmdTextPanel(cmdText){
            let div = document.createElement("div")
            let input = document.createElement("input")
            input.setAttribute("type", "text")
            input.value = cmdText
            cmdContainer.appendChild(div)
            div.appendChild(input)
        }

        function addMultilineCmdTextAreaPanel(cmdText, rowCount){
            let div = document.createElement("div")
            let textarea = document.createElement("textarea")
            textarea.setAttribute("rows", rowCount)
            textarea.value = cmdText
            cmdContainer.appendChild(div)
            div.appendChild(textarea)
        }
}