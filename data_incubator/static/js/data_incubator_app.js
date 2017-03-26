/*
Code to create new question
uiSaveQuestionDetails - handles getting data from html tags and puts in JSON payload
saveQuestionDetails - sends xhr request with JSON payload using POST
uiHandleSaveQuestionDetails - handles redirections after the receiving response from backend
uiHandleSaveQuestionDetailsError - handles error conditions
 */
function uiSaveQuestionDetails()
{
    var snObject = {};
    var elt = document.getElementById('que_text');
    if (elt) snObject.text = elt.value;
    var elt = document.getElementById('que_description');
    if (elt) snObject.description = elt.value;
    elt = document.getElementById('que_type_single');
    if (elt) snObject.single_valued = elt.checked;
    elt = document.getElementById('que_type_code');
    if (elt) snObject.coding = elt.checked;
    var elt = document.getElementById('que_testcase');
    if (elt) snObject.testcase = elt.value;
    elt = document.getElementById('que_solution');
    if (elt) snObject.solution = elt.value;
    var jsonPayload = JSON.stringify(snObject);
    console.log(jsonPayload);
    saveQuestionDetails(jsonPayload);
}

function saveQuestionDetails(payload)
{
    var oReq = new XMLHttpRequest();
    oReq.onload = uiHandleSaveQuestionDetails;
    oReq.onerror = uiHandleSaveQuestionDetailsError;
    oReq.open("post", "/api/addquestion/", true);
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(payload);
}

function uiHandleSaveQuestionDetails()
{
    if (this.status == 201) {
        console.log('uiHandleSaveQuestionDetails OK: ' + this.status);
        console.log('payload: ' + this.response);
        var objres = JSON.parse(this.response);
        if (objres) {
            console.log('objres: ' + objres.que_id);
            window.location.assign("/app/createquestion/");
        }
    }
    else {
        console.log('Unexpected status when creating new question: ' + this.status);
        console.log(this.response);
        window.location.assign("/app/error/");
    }
}

function uiHandleSaveQuestionDetailsError()
{
    console.log('Error saving details: ' + this.status);
    console.log(this.response);
    window.location.assign("/app/error/");
}

/*
Code to get feedback and save score to database
uiGetFeedback - handles getting data from html tags and puts in JSON payload
getFeedback - sends xhr request with JSON payload using POST
uiHandleGetFeedback - handles redirections after the receiving response from backend
uiHandleGetFeedbackError - handles error conditions
 */
function uiGetFeedback()
{
    var snObject = {};
    var elt = document.getElementById('que_id');
    if (elt) snObject.id = elt.value;
    elt = document.getElementById('que_ans');
    if (elt) snObject.answer = elt.value;
    var jsonPayload = JSON.stringify(snObject);
    console.log(jsonPayload);
    getFeedback(jsonPayload);
}

function getFeedback(payload)
{
    var oReq = new XMLHttpRequest();
    oReq.onload = uiHandleGetFeedback;
    oReq.onerror = uiHandleGetFeedbackError;
    oReq.open("post", "/api/getfeedback/", true);
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.send(payload);
}

function uiHandleGetFeedback()
{
    if (this.status == 201) {
        console.log('uiHandleGetFeedback OK: ' + this.status);
        console.log('payload: ' + this.response);

        var objres = JSON.parse(this.response);
        if (objres) {
            console.log('objres: ' + objres.flag);
            if(objres.flag){
                var elt = document.getElementById('feedback');
                elt.innerHTML = "<h3>Correct Solution! Score: "+objres.score+"</h3>"
            }
            else{
                var elt = document.getElementById('feedback');
                elt.innerHTML = "<h3>Incorrect Solution! Try Again. Score: 0</h3>"
            }
        }
    }
    else {
        console.log('Unexpected status when getting feedback: ' + this.status);
        console.log(this.response);
        window.location.assign("/app/error/");
    }
}

function uiHandleGetFeedbackError()
{
    console.log('Error saving details: ' + this.status);
    console.log(this.response);
    window.location.assign("/app/error/");
}