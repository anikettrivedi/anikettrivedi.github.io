let readerName = '';
let article;
let articlesMap = {};
let articlesArray = [];
let articlesArraySearchCopy = [];
let navigationArray = [];
let aboutData = [];
let maxParaLength = 0;

let ascendingSortOrder = false;
let websiteHeading = ""
let websiteHeaderMenuText = ""
let toggleTag = false;

let shareLink = document.URL;
let mainUrl = "https://anikettrivedi.github.io/blog"

window.onload = function () {

    // code to remove additional params added by instagram like fbclid etc.
    const regex = new RegExp('\\?.*id.*\\?', 'gm')
    let m;

    while ((m = regex.exec(document.URL)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        m.forEach((match, groupIndex) => {
            console.log(`redirecting from ${document.URL} to ${mainUrl}`)
            location.href = mainUrl
        });
    }

    if (document.URL.includes("/blog/about")) {
        loadAboutPage();
    } else if (document.URL.includes("/blog/page")) {
        loadBlogPage();
    } else {
        loadHomePage();
    }
};

function loadAboutPage() {
    // about page
    fetch("https://anikettrivedi.github.io/blog/static-json/about.json")
        .then(response => {
            return response.json()
        }).then(data => {
            loadAboutData(data);
        }).then(() => {
            addAboutPageContent();
        })
}

function loadBlogPage() {

    // load reader name
    readerName = getWithExpiry('readerName');

    // blog page
    let articleTitle = document.URL.substring(document.URL.indexOf("=") + 1, document.URL.length)
    fetch("https://anikettrivedi.github.io/blog/static-json/about.json")
        .then(response => {
            return response.json()
        }).then(data => {
            loadAboutData(data);
        }).then(() => {
            return fetch("https://anikettrivedi.github.io/blog/static-json/blogs.json")
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
}

function loadHomePage() {
    // home page 
    fetch("https://anikettrivedi.github.io/blog/static-json/about.json")
        .then(response => {
            return response.json()
        }).then(data => {
            loadAboutData(data);
        }).then(() => {
            return fetch("https://anikettrivedi.github.io/blog/static-json/blogs.json")
        }).then(response => {
            // fetching all articles data
            return response.json();
        }).then(dataArray => {
            for (let i = 0; i < dataArray.length; i++) {
                articlesMap[dataArray[i].index] = JSON.stringify(dataArray[i]);
            }
            displayNameAlertBox();
            loadAllArticlesData(articlesMap);
            addHomePageContent();
            loadNavigationData(articlesArray);
            addSideBarContent();
            toggleSort()
            displayVisible();
        }).catch(error => {
            display404();
            console.error(error);
        });
}

function loadHomePageAgain() {
    loadAllArticlesData(articlesMap);
    addHomePageContent();
    loadNavigationData(articlesArray);
    addSideBarContent();
}

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

    console.log(readerName)

    let view = "visible";

    if (document.URL.includes("?show=")) {
        view = document.URL.substring(document.URL.indexOf("=") + 1, document.URL.length)
    }

    let articleMap = new Map(Object.entries(data));
    let i = 0;

    if (secretNames.includes(readerName)) {
        articleMap.forEach((v, k) => {
            articleEntry = JSON.parse(v);
            articlesArray[i] = articleEntry;
            // console.log(articleEntry)
            i++;
        })
    } else if (view !== "all") {
        articleMap.forEach((v, k) => {
            articleEntry = JSON.parse(v);
            if (articleEntry.display === view) {
                articlesArray[i] = articleEntry;
                // console.log(articleEntry)
                i++;
            }
        })
    } else {
        articleMap.forEach((v, k) => {
            articleEntry = JSON.parse(v);
            articlesArray[i] = articleEntry;
            i++;
        })
    }

    articlesArray = articlesArray.sort((a, b) => b.index.localeCompare(a.index));
    articlesArraySearchCopy = articlesArray;
    // console.log("articles data loaded")
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
    // console.log("navigation data loaded")
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

    sidebar.replaceChildren()

    for (let i = 0; i < navigationArray.length; i++) {
        let a = document.createElement("a");
        a.classList.add("common-sidebar-link");

        // links to /blog/page
        if (document.URL.includes("/blog/page")) {
            // from /blog/page 
            a.href = `${document.URL.split("?title=")[0]}?title=${navigationArray[i].index}`
        } else {
            // from /blog
            a.href = `${document.URL}page?title=${navigationArray[i].index}`
        }


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
    let websiteHeadingElement = document.getElementById("common-heading")
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

    document.getElementById("common-footer").classList.add("visible-block")
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

    if (title.childNodes.length === 0) {
        title.appendChild(titleText)
    }

    let websiteHeadingElement = document.getElementById("common-heading");
    node = document.createTextNode(websiteHeading);

    if (websiteHeadingElement.childNodes.length === 0) {
        websiteHeadingElement.appendChild(node);
    }

    let headerMenuPara = document.getElementById("common-header-menu-para")
    let headerMenuParaText = document.createTextNode(websiteHeaderMenuText);

    if (headerMenuPara.childNodes.length === 0) {
        headerMenuPara.appendChild(headerMenuParaText)
    }

    addHomePageArticles();

}

function addHomePageArticles() {

    let column1 = document.getElementById("column-1");
    let column2 = document.getElementById("column-2");
    let column3 = document.getElementById("column-3");

    column1.innerHTML = "";
    column2.innerHTML = "";
    column3.innerHTML = "";

    if (window.screen.width > 1400) {
        // width > 1400, 3 column view and row wise distribution logic
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
    } else if (window.screen.width > 700 && window.screen.width <= 1400) {
        // width > 700 & <= 1400, 2 column view and row wise distribution logic
        let i = 0;
        while (i < articlesArraySearchCopy.length) {
            // (2n) th article
            if (i < articlesArraySearchCopy.length && i % 2 == 0) {
                let article = articlesArraySearchCopy[i];
                addHomePageArticleSummaryPanel(article, column1);
                i++;
            }

            // (2n + 1)th article
            if (i < articlesArraySearchCopy.length && i % 2 == 1) {
                let article = articlesArraySearchCopy[i];
                addHomePageArticleSummaryPanel(article, column2);
                i++;
            }
        }
    } else {
        // width < 700, 1 column view
        // width > 700 & <= 1400, 2 column view and row wise distribution logic
        let i = 0;
        while (i < articlesArraySearchCopy.length) {
            let article = articlesArraySearchCopy[i];
            addHomePageArticleSummaryPanel(article, column1);
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
    let articleTags = article.tags;
    let timestampText = article.timestamp;
    let headingText = article.heading;

    let articleLinkRelativePath = `${document.URL}page?title=${article.index}`
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

    articleText = articleText.trim();
    maxParaLength = maxParaLength >= articleText.length ? maxParaLength : articleText.length;
    let paraLengthDiff = maxParaLength - articleText.length;
    if (paraLengthDiff > 0) {
        articleText += "&nbsp;".repeat(paraLengthDiff);
    }

    let para = document.createElement("p");
    para.classList.add("preview-panel-para");
    para.innerHTML = articleText;

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
    websiteHeadingElement.innerHTML = "";
    node = document.createTextNode(websiteHeading);
    websiteHeadingElement.appendChild(node);

    // article timestamp
    timestampPara = document.getElementById("common-header-menu-para");
    timestampPara.innerHTML = "";
    timestampPara.classList.add("timestamp");
    timestampParaText = document.createTextNode(article.timestamp + ", " + article.place);
    timestampPara.appendChild(timestampParaText);

    let contentDiv = document.getElementById("common-content");
    contentDiv.innerHTML = "";

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

            if (entry.style !== undefined && entry.style !== '') {
                para.style.cssText = entry.style
            }

            para.appendChild(text);
            div.appendChild(para)
            contentDiv.appendChild(div);

        } else if (entry.type == "unorderedlist") {

            let div = document.createElement("div");
            let ul = document.createElement("ul");
            let arrayEntries = entry.value.split(";")

            arrayEntries.forEach((arrayEntry) => {
                let li = document.createElement("li");
                li.style.fontStyle = 'italic';

                let text = document.createTextNode(arrayEntry);
                li.appendChild(text);
                ul.appendChild(li);
            });

            div.appendChild(ul)
            contentDiv.appendChild(div);

        } else if (entry.type == "unorderedlistWithLinks") {

            let div = document.createElement("div");
            let ul = document.createElement("ul");
            let arrayEntries = entry.value;

            arrayEntries.forEach((arrayEntry) => {
                let li = document.createElement("li");
                let a = document.createElement("a");

                a.href = arrayEntry.ref
                a.innerHTML = arrayEntry.value
                a.style.fontStyle = 'italic'
                a.target = "blank";
                a.style.textDecoration = "none";

                li.appendChild(a);
                ul.appendChild(li);
            });

            div.appendChild(ul)
            contentDiv.appendChild(div);

        } else if (entry.type == "subheading") {

            let div = document.createElement("div");
            let heading = document.createElement("h3");
            let text = document.createTextNode(entry.value);
            heading.appendChild(text);
            div.appendChild(heading)
            contentDiv.appendChild(div);

        } else if (entry.type == "link") {

            let div = document.createElement("div");
            let para = document.createElement("p");
            let text = document.createTextNode(entry.value);
            let sup = document.createElement("sup");
            let a = document.createElement("a");

            a.href = entry.ref;
            a.innerHTML = entry.refNo;
            a.target = "blank";
            a.style.textDecoration = "none";

            sup.appendChild(document.createTextNode("["));
            sup.appendChild(a);
            sup.appendChild(document.createTextNode("]"));

            para.appendChild(text);
            para.appendChild(sup);

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
            iframe.style.height = "60vh"
            iframe.controls = 1;

        } else if (entry.type == "flickralbum") {

            let script = document.createElement("script");
            // script.setAttribute("async", "");
            script.charset = "utf-8";
            script.src = entry.scriptRef;
            // script.classList.add(entry.class);

            let a = document.createElement("a");
            a.setAttribute("data-flickr-embed", "true");
            // a.setAttribute("data-header", "true");
            a.setAttribute("data-context", "true");
            a.href = entry.albumRef;
            a.target = "blank";
            a.style.width = "100%";

            let img = document.createElement("img");
            img.src = entry.imgRef;
            img.style.width = "100%";
            img.classList.add(entry.class);

            a.appendChild(img);
            contentDiv.appendChild(script);
            contentDiv.appendChild(a);

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
    window.location.href = "https://anikettrivedi.github.io/blog/";
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

// window resize

(function () {
    //create a closed scope to prevent naming collision        

    //store the previous value for the width
    var previousWidth = window.innerWidth || document.body.clientWidth;

    var onResize = function () {
        var currentWidth = window.innerWidth || document.body.clientWidth;
        if (Math.abs(previousWidth - currentWidth) > 0) {
            if (!document.URL.includes("/blog/about") && !document.URL.includes("/blog/page")) {
                addHomePageArticles();
            } else if (document.URL.includes("/blog/page")) {
                window.location.reload();
            }
            previousWidth = currentWidth;
        }
    };

    window.addEventListener('resize', onResize);
})()


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
    try {
        document.getElementById("clipboard-alert-box").classList.remove("visible-block");
    } catch (err) {
        // do nothing
    }
}

// name alert box

function displayNameAlertBox() {

    if (getWithExpiry('readerName') != null) {

        readerName = getWithExpiry('readerName');
        console.log("readerName = " + readerName)
        document.getElementById("name-alert-box").classList.add("invisible")
        document.getElementById("name-alert-box").classList.remove("display-block")

    } else {
        document.getElementById("name-alert-box").classList.remove("invisible")
        document.getElementById("name-alert-box").classList.add("display-block")
    }

}

function closeNameAlertBox() {
    try {
        // console.log("closing name block!")
        document.getElementById("name-alert-box").classList.add("invisible")
    } catch (err) {
        // do nothing
    }
}

function enterName() {

    readerName = document.getElementById("name-alert-box-input").value.toLowerCase().trim();

    if (readerName !== '') {
        if (secretNames.includes(readerName)) {
            setWithExpiry('readerName', readerName, 30 * 24 * 60 * 60 * 1000);
        } else {
            setWithExpiry('readerName', readerName, 1 * 60 * 60 * 1000);
        }
    }

    // console.log('hello ' + readerName);
    // document.getElementById("name-dialog").innerHTML = "Hey " + readerName + " !";

    closeNameAlertBox();
    loadHomePageAgain();
}

function copyLinkToClipBoard() {
    navigator.clipboard.writeText(shareLink);
    document.getElementById("clipboard-dialog").innerHTML = "Link Copied!"
}

function executeEmailAction() {
    let emailAction = document.getElementById("email-actions").value;
    let subject = `Redirected from this page titled: ${document.title}`;
    let body = `Hey I just came across this page (${window.location}) on your website and I wanted to tell you that it is absolutely awesome...`;
    body = body.replace("/", "%2F");
    body = body.replace("=", "%3D");
    body = body.replace("?", "%3F");
    // 
    if (emailAction === "copy") {
        copyEmailToClipBoard();
    } else if (emailAction === "gmail") {
        window
            .open(`https://mail.google.com/mail/?view=cm&fs=1&to=${aboutData.email}&su=${subject}&body=${body}`, '_blank')
            .focus();
    } else if (emailAction === "default") {
        window
            .location = `mailto:${aboutData.email}?subject=${subject}&body=${body}`;
    }
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
    window.open(`https://api.whatsapp.com/send?text=*${document.title}* ${document.URL}`, '_blank').focus();
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
            article.description[0].value.toLowerCase().includes(searchText.toLowerCase()) ||
            article.tags.toLowerCase().includes(searchText.toLowerCase())
        ) {
            articlesArraySearchCopy[j] = article;
            j++;
        }
    }

    addHomePageArticles()
}

function searchByTagAndToggle(e) {

    // close search box if open
    if (document.getElementById("search-box").classList.contains("visible-inline")) {
        document.getElementById("search-box").classList.remove("visible-inline")
    }

    let searchText = e.target.firstChild.textContent;
    articlesArraySearchCopy = [];

    if (toggleTag) {
        articlesArraySearchCopy = articlesArray;
        // console.log(articlesArray);
    } else {
        let j = 0;
        for (let i = 0; i < articlesArray.length; i++) {
            article = articlesArray[i]
            if (article.tags.toLowerCase().includes(searchText.toLowerCase())) {
                articlesArraySearchCopy[j] = article;
                j++;
            }
        }
        // console.log(articlesArray);
    }

    toggleTag = !toggleTag;
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

// store in local storage for a fixed time
function setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl, // ttl in milliseconds
    };
    localStorage.setItem(key, JSON.stringify(item));
}

// check expiry and return from local storage
function getWithExpiry(key) {

    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
        return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Compare the current time with the expiry time
    if (now.getTime() > item.expiry) {
        // Expired: remove from storage and return null
        localStorage.removeItem(key);
        console.log('item expired')
        return null;
    }

    return item.value.trim().toLowerCase();
}

// secret names
const secretNames = ['anakin', 'anna']