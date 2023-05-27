let article;
let articlesMap = {};
let articlesArray = [];
let articlesArraySearchCopy = [];
let navigationArray = [];
let aboutData = [];

let index = document.URL.indexOf("blog");
let baseUrl = document.URL.substring(0, document.URL.indexOf("index"));
let ascendingSortOrder = true;

let websiteHeading = ""
let websiteHeaderMenuText = ""

let shareLink = document.URL;

window.onload = function () {
    if (document.URL.includes("/about")) {
        // about page
        fetch("https://anikettrivedi.github.io/assets/json/about.json").then(response => {
            return response.json()
        }).then(data => {
            loadAboutData(data);
        }).then(() => {
            addAboutPageContent();
        })

    } else if (document.URL.includes("/blog/")) {
        // article page

        let articleTitle = document.URL.substring(document.URL.indexOf("=") + 1, document.URL.length)

        fetch("https://anikettrivedi.github.io/assets/json/about.json").then(response => {
            return response.json()
        }).then(data => {
            loadAboutData(data);
        }).then(()=> {
            return fetch("https://anikettrivedi.github.io/assets/json/blogs.json")
        }).then(response => {
            // fetching all articles data
            return response.json();
        }).then(dataArray => {
            for (let i = 0; i < dataArray.length; i++) {
                articlesMap[dataArray[i].index] = JSON.stringify(dataArray[i]);
            }
            loadAllArticlesData(articlesMap);
            loadArticleData(articlesMap[articleTitle]);
            addArticlePageContent();
            loadNavigationData(articlesArray);
            addSideBarContent();
            displayVisible();
        }).catch(error => {
            display404();
            console.error(error);
        });
    } else {
        // home page

        fetch("https://anikettrivedi.github.io/assets/json/about.json").then(response => {
            return response.json()
        }).then(data => {
            loadAboutData(data);
        }).then(()=> {
            return fetch("https://anikettrivedi.github.io/assets/json/blogs.json")
        }).then(response => {
            // fetching all articles data
            return response.json();
        }).then(dataArray => {
            for (let i = 0; i < dataArray.length; i++) {
                articlesMap[dataArray[i].index] = JSON.stringify(dataArray[i]);
            }
            loadAllArticlesData(articlesMap);
            addHomePageContent();
            loadNavigationData(articlesArray);
            addSideBarContent();
            displayVisible();
        }).catch(error => {
            display404();
            console.error(error);
        });
    }
};

// http callback functions
function loadAboutData(data) {
    aboutData = data;
    websiteHeading = aboutData.websiteHeading;
    websiteHeaderMenuText = aboutData.websiteHeaderMenuText;
}

function loadArticleData(data) {
    article = JSON.parse(data);
}

function loadAllArticlesData(data) {
    let articleMap = new Map(Object.entries(data));
    let i = 0;
    articleMap.forEach((v, k) => {
        articlesArray[i] = JSON.parse(v);
        i++;
    })

    articlesArraySearchCopy = articlesArray;
    console.log("articles data loaded")
}

function loadNavigationData(data) {
    for (let i = 0; i < data.length; i++) {
        article = data[i];
        navJson = JSON.parse("{}");
        navJson.index = article.index;
        navJson.heading = article.heading;
        navJson.timestamp = article.timestamp;
        navJson.place = article.place;
        navigationArray[i] = navJson;
    }
    console.log("navigation data loaded")
}

// html body functions
function displayVisible() {
    body = document.getElementById("document-body");
    body.style.display = "flex";
}

function display404() {
    body = document.getElementById("document-body");
    body.style.display = "flex";
    body.innerHTML = "";

    h1 = document.createElement("h1");
    h1.classList.add("not-found");

    text = document.createTextNode("Page Not Found!");

    h1.appendChild(text);
    body.appendChild(h1);
}

// side bar functions

function addSideBarContent() {
    let sidebar = document.getElementById("common-sidebar");

    for (let i = 0; i < navigationArray.length; i++) {

        let a = document.createElement("a");
        a.classList.add("common-sidebar-link");
        let baseUrl = document.URL.substring(0, document.URL.indexOf("blog"));
        a.href = baseUrl + "blog?title=" + navigationArray[i].index;

        let div = document.createElement("div");
        div.classList.add("common-sidebar-item");

        let para = document.createElement("p");
        para.classList.add("common-sidebar-fontstyle");

        let text = document.createTextNode(navigationArray[i].heading);

        para.appendChild(text);
        div.appendChild(para);
        a.appendChild(div);
        sidebar.appendChild(a);
    }
}


// about page functions
function addAboutPageContent() {
    let websiteHeadingElement = document.getElementById("common-heading");
    node = document.createTextNode(websiteHeading);
    websiteHeadingElement.appendChild(node)

    let aboutImg = document.getElementById("about-img")
    aboutImg.src = aboutData.image

    let aboutPageTextContainer = document.getElementById("about-page-text-container")

    for (let i = 0; i < aboutData.contents.length; i++) {
        let aboutDataContentEntry = aboutData.contents[i];
        if (aboutDataContentEntry.type == "text") {
            let aboutPara = document.createElement("p");
            aboutPara.innerHTML = aboutDataContentEntry.value;
            aboutPara.classList.add("about-para");
            aboutPageTextContainer.appendChild(aboutPara);
        }
    }
}

// home page functions
function addHomePageContent() {

    let searchInput = document.getElementById("search-box")
    searchInput.value = ""

    searchInput.addEventListener("input", search)


    // console.log("adding homepage content");

    // add title
    let title = document.getElementById("article-title")
    let titleText = document.createTextNode(websiteHeading);
    title.appendChild(titleText)

    let websiteHeadingElement = document.getElementById("common-heading");
    node = document.createTextNode(websiteHeading);
    websiteHeadingElement.appendChild(node)

    let headerMenuPara = document.getElementById("common-header-menu-para")
    let headerMenuParaText = document.createTextNode(websiteHeaderMenuText);
    headerMenuPara.appendChild(headerMenuParaText)

    addHomePageArticles();

}

function addHomePageArticles() {

    let column1 = document.getElementById("column-1");
    let column2 = document.getElementById("column-2");
    let column3 = document.getElementById("column-3");

    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";

    let i = 0;

    while (i < articlesArraySearchCopy.length) {

        // (3n) th article
        if (i < articlesArraySearchCopy.length && i % 3 == 0) {
            let article = articlesArraySearchCopy[i];
            addHomePageArticleSummaryPanel(article, column1);
            i++;
        }

        // (3n + 1)th article
        if (i < articlesArraySearchCopy.length && i % 3 == 1) {
            let article = articlesArraySearchCopy[i];
            addHomePageArticleSummaryPanel(article, column2);
            i++;
        }

        // (3n + 2)th article
        if (i < articlesArraySearchCopy.length && i % 3 == 2) {
            let article = articlesArraySearchCopy[i];
            addHomePageArticleSummaryPanel(article, column3);
            i++;
        }

    }

    if (articlesArray.length == articlesArraySearchCopy.length && articlesArray.length > 0) {
        document.getElementById("common-footer").classList.add("visible-block")
    } else {
        document.getElementById("common-footer").classList.remove("visible-block")
    }
}

function addHomePageArticleSummaryPanel(article, element) {
    let previewPanel = document.createElement("div");
    let articleText = "";
    let articleImageURL = "";
    let articleVideoURL = "";
    let articleAudioURL = "";
    let articleAuthor = article.author;
    let timestampText = article.timestamp;
    let headingText = article.heading;
    let articleLinkRelativePath = baseUrl + "blog?title=" + article.index;

    previewPanel.classList.add("preview-panel");

    article.description.forEach(entry => {
        if (entry.type == "text") {
            articleText = entry.value;
        } else if (entry.type == "image") {
            articleImageURL = entry.value;
        } else if (entry.type == "video") {
            articleVideoURL = entry.value;
        } else if (entry.type == "audio") {
            articleAudioURL = entry.value;
        }
    });

    let heading = document.createElement("h2");
    heading.style.textAlign = "center";
    heading.appendChild(document.createTextNode(headingText))

    let line = document.createElement("div");
    line.classList.add("line-thin");
    line.classList.add("line-light");

    let timestampPara = document.createElement("p");
    timestampPara.classList.add("timestamp-small");
    timestampPara.append(document.createTextNode(timestampText));

    let para = document.createElement("p");
    para.appendChild(document.createTextNode(articleText));

    let image = document.createElement("img");
    image.classList.add("preview-panel-media")
    image.src = articleImageURL;

    let video = document.createElement("iframe");
    video.classList.add("preview-panel-media")
    video.src = articleVideoURL;

    let audio = document.createElement("audio");
    audio.classList.add("preview-panel-media")
    audio.src = articleAudioURL;

    previewPanel.appendChild(heading);

    previewPanel.appendChild(line);
    previewPanel.appendChild(timestampPara);
    previewPanel.appendChild(para);

    if (articleImageURL != "") {
        previewPanel.appendChild(image);
    }

    if (articleVideoURL != "") {
        previewPanel.appendChild(video);
    }

    if (articleAudioURL != "") {
        previewPanel.appendChild(audio);
    }


    let articleLink = document.createElement("a");
    articleLink.href = articleLinkRelativePath;
    articleLink.classList.add("link");
    articleLink.appendChild(previewPanel);

    element.appendChild(articleLink);
}

// article page function
function addArticlePageContent() {

    // article title
    document.getElementById("article-title").innerHTML = article.title;

    // article heading
    pageType = article.page;
    articleAuthor = article.author

    websiteHeadingElement = document.getElementById("common-heading");
    node = document.createTextNode(websiteHeading);
    websiteHeadingElement.appendChild(node);

    // article timestamp
    timestampPara = document.getElementById("common-header-menu-para");
    timestampPara.classList.add("timestamp");
    timestampParaText = document.createTextNode(article.timestamp + ", " + article.place);
    timestampPara.appendChild(timestampParaText);

    let contentDiv = document.getElementById("common-content");

    // article content
    articleHeading = document.createElement("h2");
    articleHeadingText = document.createTextNode(article.heading);
    articleHeading.appendChild(articleHeadingText);
    contentDiv.appendChild(articleHeading);

    if (articleAuthor != "" && articleAuthor != null) {
        let authorPara = document.createElement("p")
        authorPara.classList.add("common-author-para")
        authorPara.appendChild(document.createTextNode(articleAuthor))
        contentDiv.appendChild(authorPara)
    }

    article.contents.forEach(entry => {
        if (entry.type == "text") {
            let div = document.createElement("div");
            let para = document.createElement("p");
            let text = document.createTextNode(entry.value);
            para.appendChild(text);
            div.appendChild(para)
            contentDiv.appendChild(div);
        } else if (entry.type == "image") {
            let img = document.createElement("img");
            img.src = entry.value;
            img.classList.add(entry.class);
            contentDiv.appendChild(img);
        } else if (entry.type == "video") {
            let video = document.createElement("video");
            let source = document.createElement("source");
            video.appendChild(source);
            contentDiv.appendChild(video);
            source.src = entry.value;
            video.type = "video/mp4";
            video.classList.add(entry.class);
            video.controls = 1;
        } else if (entry.type == "iframe") {
            let iframe = document.createElement("iframe");
            contentDiv.appendChild(iframe);
            iframe.src = entry.value;
            iframe.classList.add(entry.class);
            iframe.style.height = "400px"
            iframe.controls = 1;
        } else if (entry.type == "audio") {
            let audio = document.createElement("audio");
            audio.controls = 1;
            audio.autoplay = 0;
            audio.classList.add(entry.class);
            let source = document.createElement("source");
            source.src = entry.value;
            source.type = "audio/mpeg";
            audio.appendChild(source)
            contentDiv.appendChild(audio);
        }


    });

    document.getElementById("common-footer").classList.add("visible-block")

}

// events

// button click events
function toggleSideBar() {
    if (document.getElementById("common-sidebar").classList.contains("common-sidebar-open")) {
        document.getElementById("common-sidebar").classList.remove("common-sidebar-open");
    } else {
        document.getElementById("common-sidebar").classList.add("common-sidebar-open");
        document.getElementById("common-sidebar").focus();
    }
}

function closeSideBar() {
    if (document.getElementById("common-sidebar").classList.contains("common-sidebar-open")) {
        document.getElementById("common-sidebar").classList.remove("common-sidebar-open");
    }
}

function openSideBar() {
    if (!document.getElementById("common-sidebar").classList.contains("common-sidebar-open")) {
        document.getElementById("common-sidebar").classList.add("common-sidebar-open");
    }
}


function goToHomePage() {
    window.location.href = "/";
}

// touch events
let touchstartX = 0
let touchendX = 0;

function swipeActions() {
    if (touchendX - touchstartX < -100) {
        closeSideBar();
    } else if (touchendX - touchstartX > 100) {
        openSideBar();
    }
}


// event listener && event handlers
ontouchstart = (e) => {
    touchstartX = e.changedTouches[0].screenX
}

ontouchend = (e) => {
    touchendX = e.changedTouches[0].screenX
    swipeActions()
}

onresize = () => {
    addHomePageArticles()
}

// email dialog events & functions
function openEmailAlertBox() {
    closeClipboardAlertBox();

    document.getElementById("email-alert-box-input").value = aboutData.email;
    document.getElementById("email-alert-box").classList.add("visible-block");

    setTimeout(() => {
        if (document.getElementById("email-alert-box").classList.contains("visible-block")) {
            document.getElementById("email-alert-box").classList.remove("visible-block");
        }
    }, 30 * 1000)
}

function closeEmailAlertBox() {
    document.getElementById("email-alert-box").classList.remove("visible-block");
}


// share button click events
function openClipboardDialogBox() {
    closeEmailAlertBox();

    document.getElementById("clipboard-alert-box-input").value = document.URL;
    document.getElementById("clipboard-alert-box").classList.add("visible-block");

    setTimeout(() => {
        if (document.getElementById("clipboard-alert-box").classList.contains("visible-block")) {
            document.getElementById("clipboard-alert-box").classList.remove("visible-block");
        }
    }, 30 * 1000)
}

function closeClipboardAlertBox() {
    document.getElementById("clipboard-alert-box").classList.remove("visible-block");
}

function copyLinkToClipBoard() {
    navigator.clipboard.writeText(shareLink);
    document.getElementById("clipboard-dialog").innerHTML = "Link Copied!"
}

function copyEmailToClipBoard() {
    navigator.clipboard.writeText(aboutData.email);
    document.getElementById("email-dialog").innerHTML = "Email Copied!"
}

function shareToTwitter() {
    window.open(`https://twitter.com/share?url=${document.URL}&text=${document.title}`, '_blank').focus();
}

function shareToReddit() {
    window.open(`https://reddit.com/submit?url=${document.URL}&title=${document.title}`, '_blank').focus();
}

function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer.php?u=${document.URL}`, '_blank').focus();
}

function shareToWhatsapp() {
    window.open(`https://api.whatsapp.com/send?text=${document.title} ${document.URL}`, '_blank').focus();
}

function toggleSearchBox() {
    if (document.getElementById("search-box").classList.contains("visible-inline")) {
        document.getElementById("search-box").classList.remove("visible-inline")
    } else {
        document.getElementById("search-box").classList.add("visible-inline")
        document.getElementById("search-box").focus();
        document.getElementById("search-box").select();
    }
}

function search(e) {
    let searchText = e.target.value;
    articlesArraySearchCopy = [];

    let j = 0;
    for (let i = 0; i < articlesArray.length; i++) {
        article = articlesArray[i]
        if (article.heading.toLowerCase().includes(searchText.toLowerCase()) ||
            article.author.toLowerCase().includes(searchText.toLowerCase()) ||
            article.timestamp.toLowerCase().includes(searchText.toLowerCase()) ||
            article.description[0].value.toLowerCase().includes(searchText.toLowerCase())) {
            articlesArraySearchCopy[j] = article;
            j++;
        }
    }

    addHomePageArticles()
}

function toggleSort() {
    if (ascendingSortOrder) {
        ascendingSortOrder = false;
        articlesArraySearchCopy = articlesArraySearchCopy.reverse((a, b) => b.index.localeCompare(a.index));
    } else {
        ascendingSortOrder = true;
        articlesArraySearchCopy = articlesArraySearchCopy.sort((a, b) => b.index.localeCompare(a.index));
    }

    addHomePageArticles()
}


