let depressedTags=[];
let menuOnScreen = false;
let uniqueTags = [];

//Puts all the tags in the answers at the top of the page
const makeList = function makeListOfTagsAndPutAtTheTopOfThePage(tagsOnPage) {
    transferArrayToString(tagsOnPage);

    console.log(tagsOnPage)
    tagsOnPage.forEach((tagList) => {
        tagList.forEach((tag) => {
            uniqueTags.push(tag.trim());

        });
    });

    uniqueTags = Array.from(new Set(uniqueTags));

    let place = document.getElementsByClassName("grid s-btn-group js-filter-btn")[0];
    place.innerHTML = place.innerHTML + '<div id="filterButton" class="grid--cell s-btn s-btn__muted s-btn__outlined" data-nav-xhref="" title="Answers with the latest activity first" data-value="active" data-shortcut="A">\n' +
        '            Filter</div>'

    //makes the script that's going to be added
    let scriptToAdd = '<div id="filterMenu" style="z-index:100;position:absolute;overflow:auto;display:none;top:100%;"><div class="post-taglist grid gs4 gsy fd-column"><div class="grid ps-relative d-block">';

    uniqueTags.forEach((tag) => {
        scriptToAdd = scriptToAdd + '<p style="display:block;"class="post-tag js-gps-track answer-tag" rel="tag">' + tag + '</p>';
    });
    scriptToAdd = scriptToAdd + '</div></div></div>';

    let placeForInsertion2 = document.getElementById("filterButton");
    placeForInsertion2.innerHTML=placeForInsertion2.innerHTML+(scriptToAdd);

    let dropDown = document.getElementById('filterButton');
    dropDown.addEventListener('click', updateDropDown, false);

    let buttons = document.querySelectorAll('p.answer-tag');
    buttons.forEach((btn) => {
        btn.addEventListener('click', clickHandler, false);
    });
}

function updateDropDown (e){
    if (menuOnScreen) {
        let menu = document.getElementById("filterMenu");
        menu.style.display = "none";
        menuOnScreen = false;
    }
    else{
        let menu = document.getElementById("filterMenu");
        menu.style.display = "inline-block";
        menuOnScreen = true;
    }
}

//handles clicks
const clickHandler = function handlerOfAllClicks(e){
    let tag = e.target;
    //when you click on an individual hidden answer to show it
    if(e.target.className === "answer-hidden"){
        reAdding(tag);
    }
    
    //when you click on the top tags to hide them
    else if(e.target.className === "post-tag js-gps-track answer-tag" && e.target.style.color !== CONFIG.textcolor){ //textColor is when the tags been clicked
        tag = e.target.innerHTML;
        e.target.style.backgroundColor = CONFIG.backgroundcolor;
        e.target.style.color = CONFIG.textcolor;
        depressedTags.push(tag);
        reset();
        deleting();
    }

    //resetting ALL hides
    else if(e.target.className === "post-tag js-gps-track answer-tag"){
        e.target.style.backgroundColor = '';
        e.target.style.color = '';
        depressedTags = depressedTags.filter(function(el) { return el !== tag.innerHTML; });
        reset();
    }
}

//adds the clicked answer again once the answer is clicked
const reAdding = function reAddingAnswersWhenClicked(tag){
    let answer = tag.id.substring(7,tag.id.length);

    let placeForReAdding = document.getElementById(tag.id);
    let originalAnswer = document.getElementById("answer-" + answer);

    placeForReAdding.innerHTML = originalAnswer.outerHTML;
}

//adds ALL answers again once the same tag is clicked
const reset = function reAddingAllAnswers(){
    let hiddenAnswers = document.getElementsByClassName("answer-hidden");
    Array.from(hiddenAnswers).forEach((answer)=>{
        reAdding(answer);
    });
    depressedTags.forEach((sortCategory)=>{
        deleting(sortCategory);
    });
}

//hides all the irrelevant answers
const deleting = function hidingAnswersFromUser(){
    let genList = answerTags; //list of answers to hide

    //compares the tags with the sorting category
    tagList.forEach((tagGroup) => {
        tagGroup.forEach((word)=>{
            depressedTags.forEach((category)=> {
                if (word.trim() === category.trim()) {
                    genList = genList.filter(function (n) {
                        return n !== "" && n !== tagAnswerIds[tagList.indexOf(tagGroup)];
                    });
                }
            });
        });
    });

    //hides the answers
    genList.forEach((answer)=>{
        let placeForDeletion = document.getElementById("answer-" + answer);
        placeForDeletion.outerHTML = '<div class = "answer-hidden" id = "hidden-'+answer+'"><div style="display: none;">'+placeForDeletion.outerHTML + '</div></div>';
    });


    let buttons = document.querySelectorAll('div.answer-hidden')
    buttons.forEach((btn) => {
        btn.addEventListener('click', clickHandler, false);
    });
}
//Convert all arrays in tags into strings
function transferArrayToString(tagsOnPage){
    tagsOnPage.forEach((element)=>{
        let sumTagsOfThisAnswer = [];
        if(Array.isArray(element[0])){
            element.forEach((arr)=>{
                sumTagsOfThisAnswer.push(arr.toString());

            });
            tagsOnPage[tagsOnPage.indexOf(element)] = sumTagsOfThisAnswer;
        }
    })
}