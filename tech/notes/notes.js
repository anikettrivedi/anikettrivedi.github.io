var titleChildrenArray;
var selectContainer = document.getElementById("select-container")
var cmdContainer = document.getElementById("cmd-container")

fetch('https://anikettrivedi.github.io/assets-tech/json/cmd.json')
    .then((response) => response.json())
    .then((json) => {
        //console.log(json)
        titleChildrenArray = json;
    })
    .then(() => {
        // create a drop down
        insertSelectLevel1()
        insertSelectLevel2()
    });

function insertSelectLevel1() {

    // level 1 
    let select1 = document.createElement("select")
    select1.setAttribute("name", "select-1")
    select1.setAttribute("id", "select-1")
    selectContainer.appendChild(select1)

    titleChildrenArray.forEach(
        (i) => {
            let option = document.createElement("option")
            option.setAttribute("value", i.title)
            option.appendChild(document.createTextNode(i.title))
            select1.appendChild(option)
        }
    )

    // event listener
    // update select 2 when select1 change event trigger
    select1.onchange = insertSelectLevel2
}

function insertSelectLevel2() {
    // level 2
    let select2 = document.getElementById("select-2")

    if (select2 == null) {
        // create select2 if not existing
        select2 = document.createElement("select")
    } else {
        // clear innerHTML if already existing 
        select2.innerHTML = ""
    }

    select2.setAttribute("name", "select-2")
    select2.setAttribute("id", "select-2")
    selectContainer.appendChild(select2)

    let selectValue = document.getElementById("select-1").value
    for (let i = 0; i < titleChildrenArray.length; i++) {
        if (titleChildrenArray[i].title === selectValue) {
            titleChildrenArray[i].children.forEach((childValue) => {
                //console.log(childValue)
                let option = document.createElement("option")
                option.setAttribute("value", childValue)
                option.appendChild(document.createTextNode(childValue))
                select2.appendChild(option)
            })
        }
    }

    // insert selected section when insertSelectLevel2() is called from insertSelectLevel1
    insertSelectedSection()

    // event listener
    // insert selected section when select2 change event triggers
    select2.onchange = insertSelectedSection
}

function insertSelectedSection() {
    // get selected section
    let select2Value = document.getElementById("select-2").value
    let target = `https://anikettrivedi.github.io/assets-tech/txt/${select2Value}.txt`
    fetchSectionContentsAndAdd(select2Value, target)
}

function fetchSectionContentsAndAdd(select2Value, url) {
    fetch(url)
        .then((response) => response.text())
        .then((content) => {
            // create container contents
            cmdContainer.innerHTML = ""

            // add title
            document.title = `${select2Value} commands`

            // add contents
            let contents = content.split("\n")
            for (let j = 0; j < contents.length; j++) {
                let line = contents[j]
                // add sub heading for the section
                if (line.startsWith("@h3")) {
                    let hr = document.createElement("hr")
                    let h3 = document.createElement("h3")
                    h3.appendChild(document.createTextNode(line.replace("@h3", "").trim()))
                    cmdContainer.appendChild(h3)
                    cmdContainer.appendChild(hr)
                } else if (line.startsWith("@h4")) {
                    // add command description
                    let cmdDescription = line.replace("@h4", "").trim()
                    let h4 = document.createElement("h4")
                    h4.appendChild(document.createTextNode(cmdDescription))
                    cmdContainer.appendChild(h4)
                } else if (line.startsWith("@link")) {
                    // add link
                    let href = line.replace("@link", "").trim()
                    let anchor = document.createElement("a")
                    let p = document.createElement("p")
                    p.appendChild(document.createTextNode(href))
                    anchor.setAttribute("href", href)
                    anchor.setAttribute("target", "_blank")
                    anchor.appendChild(p)
                    cmdContainer.appendChild(anchor)
                } else if (line.startsWith("@img")) {
                    // add link
                    let src = line.replace("@img", "").trim()
                    let img = document.createElement("img")
                    img.setAttribute("src", src)
                    cmdContainer.appendChild(img)
                } else if (line.startsWith("@textarea")) {
                    // add commands
                    let cmdText = line.replace("@textarea", "").trim()
                    addMultilineCmdTextAreaPanel(cmdText, 1)
                } else if (line.startsWith("@starttextarea")) {
                    let multilineCmd = ""
                    let rowCount = 0
                    j++
                    while (contents[j] !== "@endtextarea") {
                        multilineCmd += contents[j] + "\n"
                        j++
                        rowCount++
                    }
                    addMultilineCmdTextAreaPanel(multilineCmd, rowCount)
                }
            }
        })

    function addMultilineCmdTextAreaPanel(cmdText, rowCount) {
        let div = document.createElement("div")
        let textarea = document.createElement("textarea")
        textarea.setAttribute("rows", rowCount)
        textarea.value = cmdText
        cmdContainer.appendChild(div)
        div.appendChild(textarea)
    }
}