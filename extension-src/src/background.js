let fullArray = [];
let yAxis = [];
let answers = [];
const tagsAndAnswers = [];

let source;
let place;

// Opening and reading CSV file
function readTextFile(file,resolveMain,resolvePort) {
    fetch(file)
    .then(function(response) {
        if (!response.ok) {
            //can not find the matched table
            throw new Error("Not matched link")
        } 
        else {
            console.log(response);
            response.json().then(function(data) {
                openCSVfile(data)
            }).then(function(){
                answerComparer(answersId);
            }).then(function(){
                resolvePort();
            })
        }
    })
    .catch(function(err) {
       console.log(err);
       console.log("wait the result from back-end");
       //start to linsten the example web
       resolveMain();
       return "wait";
    })
}

const openCSVfile = function openCSVFileAndStoreInArrays(obj) {
    fullArray = [];
    // yAxis = obj.split("\n"); //adds every new line as a string in an array
    // for (let i = 0; i < yAxis.length; i++) {
    //     if(yAxis[i]){
    //         fullArray[i] = yAxis[i].split(/(?!\B"[^"]*),(?![^"]*"\B)/); //then splits those new line strings by comma
    //     }
    // }
    // answers = JSON.parse(obj);
    answers = obj;
    answers.forEach(function(d){
        var ans = [];
        ans.push(d.ThreadID);
        ans.push(d.AnswerID);
        ans.push(d.SentenceText);
        ans.push(d.Tags);
        fullArray.push(ans);
    });
    console.log(fullArray)
}

//compares the answerIds from SO to the ones in the CSV file
const answerComparer = function searchForSameAnswerIds(answerTags) {
    let answerIdList = [];
    console.log(answerTags);
    tagsAndAnswers.splice(0,tagsAndAnswers.length); //removes all elements in tagsAnsAnswers to prevent reduplicating tags
    //TODO: are 2d arrays enumerable? idk figure that out
    for(let i in fullArray) {
        if(fullArray[i]){
            answerIdList.push(fullArray[i][1]);
        }
    }
    let intersection = answerIdList.filter(element => answerTags.includes(element));//finds all common answerids
    console.log(intersection);
    //finds the index of those answerIDs and sends it to findTags
    if(intersection) {
        let lastLineFound = 0; //ensures no doubles
        intersection.forEach((num) => {
            //since indexOf finds the first instance, the searching start point is the index that was just found, so it doesnt find the same thing twice
            findTagsAndWords(answerIdList.indexOf(num,lastLineFound));
            lastLineFound = answerIdList.indexOf(num,lastLineFound)+1;
        });
    }

    return tagsAndAnswers;
}

//searches for tags if AnswerIDs from SO match ones in the CSV
const findTagsAndWords = function findTagsAndWordsToHighlight(lineNumber) {

    let answerID = fullArray[lineNumber][1]; //finds the AnswerID
    let words = fullArray[lineNumber][2]; //finds the word to be highlighted
    let line = fullArray[lineNumber].slice(3, fullArray[lineNumber].length); //since tags are always 4th from the left, gets everything after the 3rd entry

    let index = doubles(answerID);


    if(words.charAt(0) === '"') {
        words=words.substring(1, words.length-1);
    }

    if(line[0].match(',')) {
        let tempString = line[0];
        tempString = tempString.replace(/"/g, "");
        line = tempString.split(/,\s/);
    }

    if(index !== -1) {
        if(tagsAndAnswers[index].length>1){
            tagsAndAnswers[index].push(line);//adds to the already existing tags array
        }else{
            let pastElement = tagsAndAnswers[index];//an data structure contains all context words of pervious sentences
            let newElement = line;//an array contains all context words of current sentence
            let newCombine = [];
            newCombine.push(pastElement);
            newCombine.push(newElement)
            tagsAndAnswers[index]= newCombine;//an big array contains all context arrays 
        }
        tagsAndAnswers[index+2].push(words)//adds to the already existing words to be highlighted array
    }else{
        let phrase = [words]; //makes a new words to be highlighted array

        tagsAndAnswers.push(line, answerID,phrase);

    }
}

//checks if two csv lines that were found have the same answerID
const doubles = function checkForSimilarAnswerIDs(answerID) {
    
    let index = -1;
    tagsAndAnswers.forEach((pastAnswer) => {
        (answerID == pastAnswer) && (index = tagsAndAnswers.indexOf((pastAnswer)) - 1);
        
    });
    return index;
}

//developing now
function writeToCsv(answersInfo){
    let csvContent = "data:text/csv;charset=utf-8,";
    console.log(answersInfo);
    // answersInfo.forEach(function(rowArray) {
    //     let row = rowArray.join(",");
    //     csvContent += row + "\r\n";
    //     csvContent += "-----/////-----\\\\\-----"+ "\r\n";
        
    // });
    console.log(answersInfo);

}

let test_place;
let configFile;
let currentPage;
let original_test;
fetch("extension-src\\jsconfig.json")
    .then(response => response.json())
    .then(text => configFile = text)
    .then(text => {
        chrome.storage.sync.get(['csvSource'], function(result) {
            source = result.csvSource;
        if(source==="API") {
                test_place = text.CSVlocation;
                place = text.CSVlocation+'db/threads/';
                currentPage = test_place+"test";

                fetch(test_place+"test").then(function(response) {
                    response.json().then(function(data) {
                        original_test =  data;
                    })
                })
            }
        else{
            // readTextFile(text.CSVLocationLocal)
        }
    });

    }) //CSVlocation is where the server is

let answersId;
let firstpass = true; //checks if the first hand-off has been done yet. explained in the wiki
chrome.runtime.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        
        if (msg.allTagsFromPage==="firstpass"){ //send config file
            port.postMessage({resourceToPass: configFile});
            firstpass = false;
            
        }else { //send tags and highlights
            answersId = msg.allTagsFromPage[0];
            //main asyn ->find the matched web-(yes)->fetch data->highlight
                                            //-(no)->listen the example web->fetch data->highlight
            new Promise(function (resolveMain, reject) {
                new Promise(function (resolvePort, reject) {
                    readTextFile(place+msg.allTagsFromPage[2],resolveMain,resolvePort);
                }).then(function(){
                    port.postMessage({resourceToPass: tagsAndAnswers});
                })
            }).then(function () {
                new Promise(function (resolveBackEnd, reject) {
                    fetchFromBackEnd(resolveBackEnd);
                }).then(function(){
                    openCSVfile(test_data);
                    answerComparer(answersId);
                    port.postMessage({resourceToPass: tagsAndAnswers});
                })
            }).catch(function (err) {
                console.log(err);
            }).finally(function (value) {
                //do something
                //useless so far
            });
            
        }
    });
});

let test_data;
//keep listen on the example web
function fetchFromBackEnd(resolveBackEnd){
    var terval = setInterval(function(){
        let new_test = fetch(test_place+"test")
                        .then(function(response){
                            response.json().then(function(data) {
                                //when the database change
                                if(data.length != original_test.length){
                                    console.log("something changed");
                                    console.log("......");
                                    console.log("get the data");
                                    console.log(data);
                                    clearInterval(terval);
                                    
                                    test_data = data;
                                    resolveBackEnd();
                                }
                            })
                            
                        })
    }, 5000);// listen for changes 
}




