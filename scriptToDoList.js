'use strict'

let tasks = [];

const key = "tasksString";
const listOfTasks = document.getElementById('listTask');
const selectFilter = document.getElementById('selectFilter');
const inputTask = document.getElementById('inputTask');
const dropdownBtn = document.getElementById('dropdown-Btn');
const paginator = document.getElementById('paginator');
const radBtnAllLabel = document.getElementById('btnradioAllLabel');
const radBtnCheckLabel = document.getElementById('btnradioCheckLabel');
const radBtnUncheckLabel = document.getElementById('btnradioUncheckLabel');
const radBtnAll = document.getElementById('btnradioAll');
const radBtnCheck = document.getElementById('btnradioCheck');
const radBtnUncheck = document.getElementById('btnradioUncheck');

let pageCount = 0;
let flagChecked;
let flagUnchecked;
let colorOfTask = 'black';
dropdownBtn.style.color = 'white';

let page = 1;

initializationLocalStorage();
showTaskList(1);

function initializationLocalStorage() {
    if (localStorage.getItem(key) !== null) {
        tasks = JSON.parse(localStorage.getItem(key));
    }
}

function changeColorOfTask(idTask) {
    let colors = ['black', 'red', 'blue', 'green', 'purple'];

    let elementNumber = tasks.findIndex(item => item.id === idTask.toString());
    let i = colors.findIndex(item => item === tasks[elementNumber].color);

    i = (i < 4) ? i + 1 : 0;
    tasks[elementNumber].color = colors[i];

    refreshLocalStorage();
    showTaskList(page);
}

function chooseColorOfTask(color) {
    switch (color) {
        case '1':
            colorOfTask = 'black';
            dropdownBtn.style.color = 'white';
            break;
        case '2':
            colorOfTask = 'red';
            dropdownBtn.style.color = 'red';
            break;
        case '3':
            colorOfTask = 'blue';
            dropdownBtn.style.color = 'blue';
            break;
        case '4':
            colorOfTask = 'green';
            dropdownBtn.style.color = 'green';
            break;
        case '5':
            colorOfTask = 'purple';
            dropdownBtn.style.color = 'purple';
            break;
    }
}

function refreshLocalStorage() {
    let jsonString = JSON.stringify(tasks);
    localStorage.setItem(key, jsonString);
}

selectFilter.addEventListener('click', function (e) {
    let id = e.target.closest('label').id;
    id = id.slice(0, -5);
    filter(id);
})

listOfTasks.addEventListener('click', function (e) {
    if (e.target.tagName == 'LI') {
        let id = e.target.closest('LI').id;
        let checkedTask = tasks.findIndex(item => item.id === id);

        tasks[checkedTask].flag = (tasks[checkedTask].flag === true) ? false : true;

        refreshLocalStorage();
        showTaskList(page);
    }
});


function addTask() {
    getNewItem();
    showTaskList(1);
    return false;
}

function deleteTaskChecked() {
    clearTaskListChecked();
    showTaskList(1);
}

function deleteTaskAll() {
    clearTaskListAll();
    showTaskList(1);
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function getNewItem() {
    if (inputTask.value !== '') {
        inputTask.value = escapeHtml(inputTask.value);
        let id = Date.now().toString();

        tasks.push({ id: id, task: inputTask.value, flag: false, color: colorOfTask });

        refreshLocalStorage();

        inputTask.value = '';
        colorOfTask = 'black';
        dropdownBtn.style.color = 'white';
    }
}

function renderPagination(page, countTask) {
    paginator.innerHTML = '';
    let paginatorData = '';
    const pageTask = 5;
    pageCount = Math.ceil(countTask / pageTask);

    if (countTask > pageTask) {
        switch (page) {
            case 1:
                paginatorData =
                    `<li class="page-item disabled"><a class="page-link">
                <span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item active"><a class="page-link">1</a></li>
                <li class="page-item"><a class="page-link">..</a></li>
                <li class="page-item"><a class="page-link" href="javascript:showTaskList(pageCount)">${pageCount}</a></li> 
                <li class="page-item"><a class="page-link" href="javascript:nextPage(pageCount)">
                <span aria-hidden="true">&raquo;</span></a></li>`;
                break;
            case pageCount:
                paginatorData =
                    `<li class="page-item"><a class="page-link" href="javascript:previousPage(pageCount)">
                <span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item"><a class="page-link" href="javascript:showTaskList(1)">1</a></li>\n
                <li class="page-item"><a class="page-link">..</a></li>
                <li class="page-item active"><a class="page-link">${pageCount}</a></li>
                <li class="page-item disabled"><a class="page-link"><span aria-hidden="true">&raquo;</span></a></li>`
                break;
            default:
                paginatorData =
                    `<li class="page-item"><a class="page-link" href="javascript:previousPage(pageCount)">
                <span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item"><a class="page-link" href="javascript:showTaskList(1)">1</a></li>
                <li class="page-item active"><a class="page-link">${page}</a></li>
                <li class="page-item"><a class="page-link" href="javascript:showTaskList(pageCount)">${pageCount}</a></li>
                <li class="page-item"><a class="page-link" href="javascript:nextPage(pageCount)">
                <span aria-hidden="true">&raquo;</span></a></li>`;
                break;
        }
    } else {
        paginatorData = `<li class="page-item disabled">
                <a class="page-link" aria-disabled="true"><<</a></li>
                <li class="page-item active"><a class="page-link">1</a></li>
                <li class="page-item"><a class="page-link">..</a></li>
                <li class="page-item disabled"><a class="page-link">1</a></li>
                <li class="page-item disabled"><a class="page-link">>></a></li>`;
    }
    paginator.insertAdjacentHTML('beforeend', paginatorData);
}

function nextPage(totalPage) {
    page = (page < totalPage) ? page + 1 : totalPage;
    showTaskList(page);
}

function previousPage(totalPage) {
    page = ((page > 1) || (page === totalPage)) ? page - 1 : totalPage;
    showTaskList(page);
}

function showTaskList(currentPage) {
    listOfTasks.innerHTML = '';

    page = currentPage;

    let taskSet = '';
    let checked = 0;
    let unchecked = 0;

    let filteredArray = [];

    switch (true) {
        case flagChecked:
            filteredArray = tasks.filter(function (item) {
                return item.flag === true;
            });
            break;
        case flagUnchecked:
            filteredArray = tasks.filter(function (item) {
                return item.flag === false;
            });
            break;
        default:
            filteredArray = tasks.filter(function (item) {
                return item;
            });
            break;
    }
    tasks.forEach(element => {
        if (element.flag === true) {
            checked++;
        }
        else unchecked++;
    });

    renderPagination(currentPage, filteredArray.length);

    for (let i = currentPage * 5 - 5; ((i < currentPage * 5) && (i < filteredArray.length)); i++) {
        if (filteredArray[i].flag === true) {
            taskSet += `<div class="row mt-2"><div class="col-9 text-end"><li class="list-group-item text-start" id=
                ${filteredArray[i].id}><strike>${i + 1}. ${filteredArray[i].task}</strike></li></div>`;
        } else {
            taskSet += `<div class="row mt-2"><div class="col-9 text-end"><li class="list-group-item text-start" id=
                ${filteredArray[i].id}>${i + 1}. ${filteredArray[i].task}</li></div>`;
        }
        taskSet +=
            `<div class="col-3 text-start">
                <button type="button" class="btn btn-primary" onclick="changeColorOfTask(${filteredArray[i].id})">
                <i class="bi bi-palette" style="font-size: 1rem; color: white;"></i></button>
                <div class="btn-group" role="group"><button type="button" id=${filteredArray[i].id + "edit"} 
                class="btn btn-outline-primary" onclick="editTask(${filteredArray[i].id})">
                <i class="bi bi-pencil" style="font-size: 1rem; color: cornflowerblue"></i>
                Редактировать</button>
                <button type="button" id=${filteredArray[i].id + "delete"} 
                class="btn btn-outline-primary" onclick="deleteOneTask(${filteredArray[i].id})">
                <i class="bi bi-trash" style="font-size: 1rem; color: cornflowerblue"></i> Удалить</button></div></div></div>`;
    }

    listOfTasks.insertAdjacentHTML('beforeend', taskSet);
    for (let i = currentPage * 5 - 5; ((i < currentPage * 5) && (i < filteredArray.length)); i++) {
        document.getElementById(filteredArray[i].id).style.color = filteredArray[i].color;
    }

    radBtnAllLabel.textContent = 'Показать все (' + tasks.length + ')';
    radBtnCheckLabel.textContent = 'Выполненные (' + checked + ')';
    radBtnUncheckLabel.textContent = 'Невыполненные (' + unchecked + ')';
}

function clearTaskListChecked() {
    if (tasks.length !== 0) {
        tasks = tasks.filter(function (element) {
            return !element.flag;
        });
        refreshLocalStorage();
    }
}

function clearTaskListAll() {
    localStorage.removeItem(key);
    tasks.length = 0;

    listOfTasks.innerHTML = "";
}

function filter(id) {
    radBtnCheck.classList.remove('checked');
    radBtnUncheck.classList.remove('checked');
    radBtnAll.classList.remove('checked');

    flagChecked = false;
    flagUnchecked = false;

    switch (id) {
        case radBtnAll.id:
            radBtnAll.classList.add('checked');
            showTaskList(1);
            break;
        case radBtnCheck.id:
            radBtnCheck.classList.add('checked');
            flagChecked = true;
            showTaskList(1);
            break;
        case radBtnUncheck.id:
            radBtnUncheck.classList.add('checked');
            flagUnchecked = true;
            showTaskList(1);
            break;
    }
}

function editTask(idTask) {
    let editableTask = document.getElementById(idTask);
    editableTask.contentEditable = true;

    let range = document.createRange();  ///////пока хз как работает
    let select = window.getSelection();

    let position = editableTask.textContent.indexOf(".") + 1;
    editableTask.textContent = editableTask.textContent.slice(position);

    range.setStart(editableTask, 1);
    range.collapse(true);
    select.removeAllRanges();
    select.addRange(range);

    editableTask.focus();

    editableTask.addEventListener("focusout", function () {
        if (editableTask.textContent !== '') {
            editableTask.textContent = escapeHtml(editableTask.textContent);
            let idTaskInArray = tasks.findIndex(item => item.id === idTask.toString());
            tasks[idTaskInArray].task = editableTask.textContent;
            refreshLocalStorage();
        }
        showTaskList(page);
    });
}

function deleteOneTask(idTask) {
    tasks = tasks.filter(function (item) {
        return !(item.id === idTask.toString());
    });
    refreshLocalStorage();
    showTaskList(1);
}
