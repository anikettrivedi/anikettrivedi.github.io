var titleChildrenArray;
var selectContainer = document.getElementById("select-container")
var cmdContainer = document.getElementById("cmd-container")
var optgroupMap = new Map();
var type = ""
var subtype = ""

try {
    type = document.URL.split("?")[1].split("type=")[1].split("&")[0]
    subtype = document.URL.split("?")[1].split("subtype=")[1].split("&")[0]
} catch (ignore) { }

// todo - end

fetch('https://anikettrivedi.github.io/tech/_json/cmd.json')
    .then((response) => response.json())
    .then((json) => {
        //console.log(json)
        titleChildrenArray = json;
    })
    .then(() => {
        // create a drop down
        insertSelectLevel1()
        insertSelectLevel2()

        insertButton()
        insertSelectedSection()
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

            let optgroup = null
            if (optgroupMap.has(i.optgroup)) {
                optgroup = optgroupMap.get(i.optgroup)
            } else {
                optgroup = document.createElement("optgroup")
                optgroupMap.set(i.optgroup, optgroup)
                optgroup.label = i.optgroup
                select1.appendChild(optgroup)
            }
            optgroup.appendChild(option)
        }
    )

    if (type === "") {
        // set type if not set already
        type = select1.value
    } else {
        // set select as type if type is provided
        select1.value = type
    }

    // set type if not set already
    type = select1.value

    // if type is still empty (in case of invalid type param) after above command
    // set it to first option value
    if (type === "") {
        type = select1.options[0].text
        select1.value = type
    }

    // console.log(`type=${type}`)

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
        select2.setAttribute("name", "select-2")
        select2.setAttribute("id", "select-2")
        selectContainer.appendChild(select2)
    } else {
        // remove all options under select
        let i, L = select2.options.length - 1;
        for (i = L; i >= 0; i--) {
            select2.remove(i);
        }
    }

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

    if (subtype === "") {
        // set subtype if not set already
        subtype = select2.value
    } else {
        // set select as type if type is provided
        select2.value = subtype
    }

    // set subtype if not set already
    subtype = select2.value

    // if subtype is still empty (in case of invalid subtype param) after above command
    // set it to first option value
    if (subtype === "") {
        subtype = select2.options[0].text
        select2.value = subtype
    }

    // console.log(`type=${type}`)
    // console.log(`subtype=${subtype}`)
}

function insertButton() {
    var button = document.getElementById("button")
    if (button == null || button == undefined) {
        button = document.createElement("button")
        button.setAttribute("id", "button")
        button.appendChild(document.createTextNode("go"))
        selectContainer.appendChild(button)
        button.onclick = navigateOnButtonClick
    }
}

function navigateOnButtonClick() {
    type = document.getElementById("select-1").value
    subtype = document.getElementById("select-2").value
    window.location.href = `${document.URL.split("?")[0]}?type=${type}&subtype=${subtype}`
}

function insertSelectedSection() {
    // get selected section
    let target = `https://anikettrivedi.github.io/tech/_txt/${type}/${subtype}.txt`
    fetchSectionContentsAndAdd(subtype, target)
}

function fetchSectionContentsAndAdd(select2Value, url) {
    fetch(url)
        .then((response) => response.text())
        .then((content) => {
            // create container contents
            cmdContainer.innerHTML = ""

            // add title
            document.title = `${select2Value}`

            // add contents
            let contents = content.split("\n")
            for (let j = 0; j < contents.length; j++) {
                let line = contents[j]
                // add sub heading for the section
                if (line.startsWith("@h3")) {

                    let hr = document.createElement("hr")

                    // add command description
                    let cmdDescription = line.replace("@h3", "").trim()
                    let h3 = document.createElement("h3")

                    if (cmdDescription.startsWith("@del")) {
                        let del = document.createElement("del")
                        cmdDescription = cmdDescription.replace("@del", "").trim()
                        del.appendChild(document.createTextNode(cmdDescription))
                        h3.appendChild(del)
                    } else {
                        h3.appendChild(document.createTextNode(cmdDescription))
                    }
                    
                    cmdContainer.appendChild(h3)
                    cmdContainer.appendChild(hr)

                } else if (line.startsWith("@h4")) {

                    // add command description
                    let cmdDescription = line.replace("@h4", "").trim()
                    let h4 = document.createElement("h4")

                    if (cmdDescription.startsWith("@del")) {
                        let del = document.createElement("del")
                        cmdDescription = cmdDescription.replace("@del", "").trim()
                        del.appendChild(document.createTextNode(cmdDescription))
                        h4.appendChild(del)
                    } else {
                        h4.appendChild(document.createTextNode(cmdDescription))
                    }

                    cmdContainer.appendChild(h4)
                } else if (line.startsWith("@link")) {
                    // add link
                    let href = line.replace("@link", "").trim()
                    let anchor = document.createElement("a")
                    // let p = document.createElement("p")
                    anchor.appendChild(document.createTextNode(`@${href}`))
                    anchor.setAttribute("href", href)
                    anchor.setAttribute("target", "_blank")
                    // anchor.appendChild(p)
                    cmdContainer.appendChild(anchor)
                } else if (line.startsWith("@img")) {
                    // add link
                    let src = line.replace("@img", "").trim()
                    let img = document.createElement("img")
                    img.setAttribute("src", src)
                    cmdContainer.appendChild(img)
                } else if (line.startsWith("@ol")) {
                    // add ordered link
                    let olText = line.replace("@ol", "").trim()
                    let olLiTextArray = olText.split("/")
                    let ol = document.createElement("ol")
                    cmdContainer.appendChild(ol)
                    for (let liIndex in olLiTextArray) {
                        let li = document.createElement("li")
                        li.appendChild(document.createTextNode(olLiTextArray[liIndex].trim()))
                        ol.appendChild(li)
                    }
                } else if (line.startsWith("@textarea")) {
                    // text area for code
                    let cmdText = []
                    cmdText.push(line.replace("@textarea", "").trim())
                    addMultilineCmdTextAreaPanel(cmdText)
                } else if (line.startsWith("@starttextarea")) {
                    // multiline text area for code
                    let multilineCmd = []
                    j++
                    while (contents[j] !== "@endtextarea") {
                        multilineCmd.push(contents[j])
                        j++
                    }
                    addMultilineCmdTextAreaPanel(multilineCmd)
                } else if (line.startsWith("@pre")) {
                    // preformatted text
                    let cmdText = []
                    cmdText.push(line.replace("@pre", "").trim())
                    addPreformattedText(cmdText)
                } else if (line.startsWith("@startpre")) {
                    // multiline preformatted text
                    j++
                    let multilineCmd = []
                    while (contents[j] !== "@endpre") {
                        multilineCmd.push(contents[j])
                        j++
                    }
                    addPreformattedText(multilineCmd)
                }
            }
        })
}

function addMultilineCmdTextAreaPanel(multilineCmd) {
    let div = document.createElement("div")
    let textarea = document.createElement("textarea")
    textarea.setAttribute("rows", multilineCmd.length)
    let text = multilineCmd.join('\n')
    // console.log(multilineCmd)
    // console.log(text)
    textarea.value = text
    cmdContainer.appendChild(div)
    div.appendChild(textarea)
}

function addPreformattedText(multilineCmd) {
    // console.log(multilineCmd)
    let div = document.createElement("div")
    let pre = document.createElement("pre")
    let text = multilineCmd.join('\n')
    // console.log(multilineCmd)
    // console.log(text)
    pre.appendChild(document.createTextNode(text))
    cmdContainer.appendChild(div)
    div.appendChild(pre)
}
