
//Set minimun date input value to "today"
inputDate.min = new Date().toISOString().split("T")[0];
//Set date value to "today"
inputDate.value = new Date().toISOString().split("T")[0];

const table = document.getElementById("toDoTable");
const tableBody = document.getElementById("tableBody");
const createTaskBtn = document.getElementById("createTask");
const cancelBtn = document.getElementById("cancel");
const deleteBtn = document.getElementById("delete");
const editBtn = document.getElementById("edit")

let rowParent;
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

        const dateFormat = [`${this.date[2]}`, `${monthValue}`, `${this.date[0]}`].join(" ")

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
        <i class="far fa-check-circle text-muted" id="check-icon"></i>
     </th>
     <td class="task lato pointer">${taskTitle}</th>
     <td class="complete lato">${finalDate}</th>
     <td class="action">
        <i class="fas fa-pencil-alt text-muted mr-3" data-toggle="modal" data-target="#modalEdit" onclick="getRowParentElement2(this);"></i>
        <i class="far fa-trash-alt text-muted" data-toggle="modal" data-target="#deleteModal" id="deleteIcon" onclick="getRowParentElement(this);"></i>
     </td>
    </tr>
    `;
    //Clean "Add Task" forms 
    document.getElementById("inputDate").value = new Date().toISOString().split("T")[0];
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputDescription").value = "";
})

deleteBtn.addEventListener('click', () => {
    const i = rowParent.parentNode.parentNode.rowIndex;
    document.getElementById("tableBody").deleteRow(i - 1);
})

editBtn.addEventListener('click', () => {
    
})

function getRowParentElement(rowObj){
    rowParent = rowObj;
} 

function getRowParentElement2(rowObj){
    rowParent = rowObj;
    const i = rowParent.parentNode.parentNode.rowIndex;
    const getTitle = document.getElementById("tableBody").rows[i - 1].cells.item(1).innerHTML;
    document.getElementById("editTitle").value = getTitle;
    let getDate = document.getElementById("tableBody").rows[i - 1].cells.item(2).innerHTML;
    getDate = getDate.split(" ");
    getDate = `${getDate[0]}-${getDate[1]}-${getDate[2]}`
    console.log(getDate)
    document.getElementById("editDate").value = getDate;    
} 