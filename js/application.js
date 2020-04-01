
//Set minimun date input value to "today"
inputDate.min = new Date().toISOString().split("T")[0];
editDate.min = new Date().toISOString().split("T")[0];
//Set date value to "today"
inputDate.value = new Date().toISOString().split("T")[0];

const table = document.getElementById("toDoTable");
const tableBody = document.getElementById("tableBody");
const createTaskBtn = document.getElementById("createTask");
const cancelBtn = document.getElementById("cancel");
const deleteBtn = document.getElementById("delete");
const editBtn = document.getElementById("edit");
const incompletedTask = document.getElementById("incompletedTask");

let toDosCount = 0;
let tableCount = 0;
let rowParentIndex;
let taskTitle;
let taskLimitDate;
let taskDescription;

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

class DateObj { 
    constructor(lmtDate, tdyDate) {
        this.date = lmtDate;
        this.today = tdyDate.toLocaleDateString(undefined, dateOptions).split(/[, ]/);
    }
    monthToText() {
        //Transform date format to "dd mmm yyyy" (08 May 2020)
        let monthValue = Math.abs(this.date[1]);
        monthValue = months[monthValue - 1]

        const dateFormat = `${this.date[2]} ${monthValue} ${this.date[0]}`;

        return dateFormat;
    }
    formatedDate(){
        //Transform date format to "dddd dd, mmmm yyyy" (Monday 1, December 2020)
        return `${this.today[0]} ${this.today[3]}, ${this.today[2]} ${this.today[5]}`
    }
}

//Set today date to navbar element -> #todayDate
const unformatedTodayDate = new Date()
const dateEdit = new DateObj(undefined, unformatedTodayDate)
const formatedTodayDate = dateEdit.formatedDate();
document.getElementById("todayDate").innerHTML = formatedTodayDate;


cancelBtn.addEventListener('click', () => {
    //Clean "Add Task" forms
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputDescription").value = "";
    document.getElementById("inputDate").value = new Date().toISOString().split("T")[0];
})

createTaskBtn.addEventListener('click', () => {
    //Get "Add task" forms values
    taskTitle = document.getElementById("inputTitle").value;
    taskLimitDate = document.getElementById("inputDate").value.split("-");
    taskDescription = document.getElementById("inputDescription").value;
    //Transform limit date format to "dd mmm yyyy" (08 May 2020)
    const dateEdit2 = new DateObj(taskLimitDate, unformatedTodayDate)
    const finalDate = dateEdit2.monthToText();
    //Add a new row
    const row = tableBody.insertRow(0);
    row.innerHTML =
    `
    <tr class="colborder">
     <th scope="row" class="checkicon colborder">
        <i class="far fa-check-circle text-muted" id="check-icon" onclick="changeStateToCheck(this);"></i>
        <i class="far fa-times-circle text-danger d-none" id="times-icon" onclick="changeStateToUnCheck(this);"></i>
     </th>
     <td class="task lato pointer" onclick="showPreview(this);">${taskTitle}</th>
     <td class="complete lato">${finalDate}</th>
     <td class="action" data-description="${taskDescription}">
        <i class="fas fa-pencil-alt text-muted mr-3" data-toggle="modal" data-target="#modalEdit" onclick="getRowParentElement2(this);"></i>
        <i class="far fa-trash-alt text-muted" data-toggle="modal" data-target="#deleteModal" id="deleteIcon" onclick="getRowParentElement(this);"></i>
     </td>
    </tr>
    `;
    //Clean "Add Task" forms 
    document.getElementById("inputDate").value = new Date().toISOString().split("T")[0];
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputDescription").value = "";

    tableCount += 1;
    if(tableCount > 6){
        document.getElementById("preview").style.position = "relative";
    }

    toDosCount += 1;
    incompletedTask.innerHTML =`${toDosCount} Incompleted Task`;
})

deleteBtn.addEventListener('click', () => {
    const i = rowParentIndex.parentNode.parentNode.rowIndex;
    document.getElementById("tableBody").deleteRow(i - 1);
    tableCount -= 1;
    if(tableCount < 7){
        document.getElementById("preview").style.position = "absolute";
    }

    toDosCount -= 1;
    if(toDosCount < 1){
        incompletedTask.innerHTML =` Incompleted Task`;
    }else{
        incompletedTask.innerHTML =`${toDosCount} Incompleted Task`;
    }
})

editBtn.addEventListener('click', () => {
    const i = rowParentIndex.parentNode.parentNode.rowIndex;
    taskTitle = document.getElementById("editTitle").value;
    taskLimitDate = document.getElementById("editDate").value.split("-");
    taskDescription = document.getElementById("editDescription").value;

    const dateEdit2 = new DateObj(taskLimitDate, unformatedTodayDate)
    const finalDate = dateEdit2.monthToText();

    console.log(finalDate)

    document.getElementById("tableBody").rows[i - 1].cells.item(1).innerHTML = taskTitle;
    document.getElementById("tableBody").rows[i - 1].cells.item(2).innerHTML = finalDate;

    const rowParent = rowParentIndex.parentNode;
    rowParent.dataset.description = taskDescription;
})

function getRowParentElement(rowObj){
    rowParentIndex = rowObj;
} 

function getRowParentElement2(rowObj){
    rowParentIndex = rowObj;
    const i = rowParentIndex.parentNode.parentNode.rowIndex;
    //Retrieve row value "TITLE"
    const getTitle = document.getElementById("tableBody").rows[i - 1].cells.item(1).innerHTML;
    document.getElementById("editTitle").value = getTitle;
    //Retrieve row value "Date" and convert date from "dd-mmm-yyyy" to "yyyy-mm-dd"
    let getDate = document.getElementById("tableBody").rows[i - 1].cells.item(2).innerHTML;
    getDate = getDate.replace(/ /g,"-").replace(/-----/g,"").replace(/\n/g,"");
    getDate = getDate.split("-");
    const index = months.findIndex(month => month === getDate[1]);
    if(index >= 0 && index < 9){
        getDate = `${getDate[2]}-0${index + 1}-${getDate[0]}`
    }
    else{
        getDate = `${getDate[2]}-${index + 1}-${getDate[0]}`
    }
    document.getElementById("editDate").value = getDate;
    //Retrieve row value "DESCRIPTION"
    const rowParent = rowObj.parentNode;
    document.getElementById("editDescription").value = rowParent.dataset.description;
}

function showPreview(rowObj){
   const i = rowObj.parentNode.rowIndex;
   const elementSibling = rowObj.nextSibling.nextSibling;
   const descPreview = elementSibling.dataset.description;
   const getTitle = document.getElementById("tableBody").rows[i - 1].cells.item(1).innerHTML;

   document.getElementById("preview").innerHTML =
   `
    <nav class="navbar mt-4">
        <h3 class="lato mb-3">${getTitle}</h3>
        <p class="text-muted">needs to be completed on</p>
    </nav>

    <p class="font-weight-bold ml-3">${descPreview}</p>
   `
}

function changeStateToCheck(rowObj){
    const timesIconElement = rowObj.parentNode.lastElementChild;
    timesIconElement.classList.remove("d-none");
    rowObj.style.display = "none"
}

function changeStateToUnCheck(rowObj){
    const checkIconElement = rowObj.parentNode.firstElementChild;
    rowObj.classList.add("d-none");
    checkIconElement.style.display = "inline-block"
}

