let tagWords;
let tagAnswerIds;
let tagList;

//Retrieves Question IDs from the SO page
let page = document.getElementsByClassName('question');
let questionTag;

for (let node of page){
	let attrs = node.attributes;
	let num_attr = attrs.length;

	for (let i = 0; i < num_attr; i++) {
		let attr = attrs[i];
		if (!isNaN(attr.nodeValue)){
			questionTag=attr.nodeValue;
			console.log(questionTag);
		}
	}
}

//Retrieves answer IDs from the SO page
let answerPage = document.getElementsByClassName('answer');
let answerTags = [];

for (let node of answerPage){
	let attrs = node.attributes;
	let num_attr = attrs.length;
	for (let i = 0; i <num_attr; i++) {
		let attr = attrs[i];
		if ((!isNaN(attr.nodeValue))&&attr.nodeValue!=""){
			answerTags.push(attr.nodeValue);
		}
	}
}
// console.log(answerTags);
//Retrieves answers innerHTML from the SO page
let threads = [];
for (let node of answerTags){

	let thread = document.getElementById("answer-" + node).getElementsByTagName("p");
	let contents = [];
	for (let i = 0; i <thread.length; i++) {
		contents.push(thread[i].innerHTML) ;
	}
	let answerInfo = [];
	answerInfo.push(node);
	answerInfo.push(contents);
	threads.push(answerInfo);
}

let pageInfo = [];
//1.answer id 2. answer body 3.question id
pageInfo.push(answerTags);
pageInfo.push(threads);
pageInfo.push(questionTag);

let firstpass = true;
let CONFIG;

var port = chrome.runtime.connect({name: "getConfigFile"});

port.postMessage( {allTagsFromPage: "firstpass"} );
port.onMessage.addListener( function(msg) {
	if (typeof msg.resourceToPass !== "string" && !firstpass) {
		console.log(2);
		insertingTags(msg.resourceToPass);
		firstpass = true;
	}
	else {
		CONFIG = msg.resourceToPass;
		port.postMessage( {allTagsFromPage: pageInfo} );
		firstpass = false;
	}
});
let placeIntagLink;
//inserts the tags into the SO page
const insertingTags = function insertingResponseFromBackground(tagInfo){
	console.log(tagInfo);

	tagList = tagInfo.filter(function(value, index, Arr) { //gets all the tags
		return index % 3 === 0;
	});
	tagAnswerIds = tagInfo.filter(function(value, index, Arr) {//gets all the corresponding answer ids
		return (index-1) % 3 === 0;
	});
	tagWords = tagInfo.filter(function(value, index, Arr) {//gets all the corresponding highLightContent to be highlighted
		return (index-2) % 3 === 0;
	});

	for (let k = 0; k <tagList.length; k += 1) { //TODO: figure out how to do this w/o an iterator
		let placeForInsertion = document.getElementById("answer-" + tagAnswerIds[k]);
		let tagsInsertionPlace = placeForInsertion.querySelectorAll('p,li,h1,h2');

		//highlight the sentences
		console.log(tagsInsertionPlace);
		Array.from(tagsInsertionPlace).forEach((collection)=>{
			
			var containers = collection.querySelectorAll("*");
			let textContent = collection.outerText;
			tagWords[k].forEach((highLightContent)=>{
				if(textContent.includes(highLightContent)){
					if(containers.length!=0){
						let innerContent = collection.innerHTML;
						let tagsPlaceInnerHTML = [];
						let backGroundTagPlace = [];
						for(let k=0;k<containers.length;k+=1){
							if(tagsPlaceInnerHTML.ength==0){
								tagsPlaceInnerHTML.push(innerContent.indexOf(containers[k].outerHTML));
							}else{
								tagsPlaceInnerHTML.push(innerContent.indexOf(containers[k].outerHTML,tagsPlaceInnerHTML[k-1]));
							}
						}
						console.log(containers);
						console.log(innerContent);
						// let mid = "";
						let highlightTagOpen;
						let highlightTagClose;
						let begins = textContent.indexOf(highLightContent);
						if (begins >= 0) {

							highlightTagOpen = "<span class ='changeBackgroundColor' style='background-color:yellow;'>";
							highlightTagClose = "</span>";
							textContent  = textContent.substring(0,begins) + highlightTagOpen + textContent.substring(begins,begins+highLightContent.length) + highlightTagClose + textContent.substring(begins+highLightContent.length, textContent.length);
							backGroundTagPlace.push(textContent.indexOf(highlightTagOpen));
							backGroundTagPlace.push(textContent.indexOf(highlightTagClose)-highlightTagOpen.length);
						}
						for(let k=0;k<containers.length;k+=1){
							if(backGroundTagPlace[0]<=tagsPlaceInnerHTML[k]){
								break;
								// innerContent = innerContent.substring(0,backGroundTagPlace[0]) + highlightTagOpen + innerContent.substring(backGroundTagPlace[0], innerContent.length);
							}
							let tagLength = containers[k].outerHTML.length-containers[k].outerText.length;
							console.log(tagLength);
							backGroundTagPlace[0] = backGroundTagPlace[0]+tagLength;

						}
						for(let k=0;k<containers.length;k+=1){
							if(backGroundTagPlace[1]<=tagsPlaceInnerHTML[k]){
								break;
								// innerContent = innerContent.substring(0,backGroundTagPlace[1]) + highlightTagClose + innerContent.substring(backGroundTagPlace[1], innerContent.length);
							}
							let tagLength = containers[k].outerHTML.length-containers[k].outerText.length;
							console.log(tagLength);
							backGroundTagPlace[1] = backGroundTagPlace[1]+tagLength;

						}

						innerContent = innerContent.substring(0,backGroundTagPlace[0]) + highlightTagOpen +innerContent.substring(backGroundTagPlace[0], backGroundTagPlace[1])+ highlightTagClose+innerContent.substring(backGroundTagPlace[1], innerContent.length);
						collection.innerHTML = innerContent;
					}else{
						let begins = textContent.indexOf(highLightContent);
						if (begins >= 0) {

							highlightTagOpen = "<span class ='changeBackgroundColor' style='background-color:yellow;'>";
							highlightTagClose = "</span>";
							textContent  = textContent.substring(0,begins) + highlightTagOpen + textContent.substring(begins,begins+highLightContent.length) + highlightTagClose + textContent.substring(begins+highLightContent.length, textContent.length);
							collection.innerHTML = textContent;
						}
					}
				}
			})
		})
		//add the tags for the answers
		var answerTagsList = document.createElement('answerTag');
		answerTagsList.setAttribute('id', "answerTag");
		answerTagsList.setAttribute('class','"answer-"'+tagAnswerIds[k]+'"-taglist grid gs4 gsy fd-column">');
		var answerTags = document.createElement('div');
		answerTags.setAttribute("class","grid ps-relative");
		
		tagList[k].forEach((words) => {
			placeIntagLink = 0;
			var answerTag = document.createElement('a');
			answerTag.innerHTML= words;
			answerTag.setAttribute("id","tag"+tagAnswerIds[k]);
			answerTag.setAttribute("class","post-tag js-gps-track answer-tag");
			answerTag.setAttribute("title","show answers tagged " +words);
			answerTag.setAttribute("rel","tag");
			tagWords[k].forEach((sentence) => {
				if (sentence.toLowerCase().includes(words.toString().toLowerCase())) {
					answerTag.setAttribute("place",placeIntagLink);
				}else{
					console.log("the context word is not in the sentence");
				}
				placeIntagLink=placeIntagLink+1;
			});
			answerTags.append(answerTag);

		});
		answerTagsList.appendChild(answerTags);
		placeForInsertion.getElementsByClassName("post-layout--right")[0].appendChild(answerTagsList);

	}
	let buttons =  document.querySelectorAll('a.answer-tag');
	console.log(buttons)
	buttons.forEach((btn) => {
		btn.setAttribute('answerId', btn.id.slice(3));
		btn.setAttribute("place",btn.getAttribute("place"))
		btn.addEventListener('click', clickTagAnswers);
	});
	makeList(tagList);
}
//add click listener for the tags of the answers
const clickTagAnswers = function handlerOfAllClicks(e){

	let backGround = document.getElementById("answer-" +this.getAttribute("answerId")).getElementsByClassName("changeBackgroundColor")[this.getAttribute("place")]
	if(backGround.style.backgroundColor=="yellow"){
		backGround.style.backgroundColor="white";
	}else{
		backGround.style.backgroundColor="yellow";
	}
}
