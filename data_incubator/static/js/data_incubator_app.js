HTMLElement.prototype.click = function() {
   var evt = this.ownerDocument.createEvent('MouseEvents');
   evt.initEvent('click', true, true, this.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
   this.dispatchEvent(evt);
}


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
        // All is well, let's return to the snapshot detail page
        console.log('uiHandleSaveSnapshot OK: ' + this.status);
        console.log('payload: ' + this.response);

        var objres = JSON.parse(this.response);
        if (objres) {
            console.log('objres: ' + objres.snap_id);
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
    // TODO: Notify the user of failure
    console.log('Error saving details: ' + this.status);
    console.log(this.response);
}


function uiGetFeedback(id)
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
        // All is well, let's return to the snapshot detail page
        console.log('uiHandleSaveSnapshot OK: ' + this.status);
        console.log('payload: ' + this.response);

        var objres = JSON.parse(this.response);
        if (objres) {
            console.log('objres: ' + objres.flag);
            if(objres.flag){
                var elt = document.getElementById('feedback');
                elt.innerHTML = "<h3>Correct Solution</h3>"
            }
            else{
                var elt = document.getElementById('feedback');
                elt.innerHTML = "<h3>Incorrect Solution! Try Again</h3>"
            }
        }
    }
    else {
        // TODO: Notify the user of failure
        console.log('Unexpected status when saving snapshot: ' + this.status);
        console.log(this.response);
    }
}

function uiHandleGetFeedbackError()
{
    // TODO: Notify the user of failure
    console.log('Error saving details: ' + this.status);
    console.log(this.response);
}