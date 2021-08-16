'use strict'

let tasks = [];
const key = "tasksString";
let modal = document.getElementById('myModal');

console.log(localStorage);

tasks = localstorageToArray();
showTaskList();

function localstorageToArray() {
    if (localStorage.getItem(key) !== null) {
        tasks = JSON.parse(localStorage.getItem(key));
    }
    return tasks;
}

document.querySelector('#listTask').addEventListener('click', function(e){ 
    let id = e.target.id;
    let checkedTask = tasks.findIndex(item => item[0].id === id);

    if (tasks[checkedTask][1].flag) {
        tasks[checkedTask][1].flag = false;
    } else {
        tasks[checkedTask][1].flag = true;
    }

    let jsonString = JSON.stringify(tasks);
    localStorage.setItem(key, jsonString);

    showTaskList();
});
    
function addTask() {
    getNewItem();
    showTaskList();
    return false;
}

function deleteTask() {
    clearTaskListChecked();
    showTaskList();
}

function getNewItem() {
    let element = document.getElementById('inputTask').value;

    if (element !== '') {
        let id = Date.now().toString();

        tasks.push( [ {id: id}, {task: element, flag: false} ] );

        let jsonString = JSON.stringify(tasks);
        localStorage.setItem(key, jsonString);

        document.getElementById('inputTask').value = '';
    }
}

function showTaskList() {
    let taskList = document.getElementById('listTask');

    while(taskList.firstChild) {
        taskList.removeChild( taskList.firstChild );
    }

    let item = '';
    let checked = 0;
    let unchecked = 0;

    for(let i = 0; i < tasks.length; i++) {
        if (tasks[i][1].flag) {
            item += `<li class="list-group-item" id=${tasks[i][0].id}><strike>${i + 1}. ${tasks[i][1].task}</strike></li>`;
            checked++;
        } else {
            item += `<li class="list-group-item" id=${tasks[i][0].id}>${i + 1}. ${tasks[i][1].task}</li>`;
            unchecked++;
        } 
    }

    taskList.insertAdjacentHTML('beforeend', item);

    selectFilter.options[0].text = 'Показать все';
    selectFilter.options[1].text = 'Выполненные';
    selectFilter.options[2].text = 'Невыполненные';
    selectFilter.options[0].insertAdjacentHTML('beforeend', ' (' + tasks.length +')');;
    selectFilter.options[1].insertAdjacentHTML('beforeend', ' (' + checked +')');;
    selectFilter.options[2].insertAdjacentHTML('beforeend', ' (' + unchecked +')');;
}

function clearTaskListChecked() {
    if (tasks.length !== 0) {
        for(let i = 0; i < tasks.length; i++) {
            if (tasks[i][1].flag) {
                tasks.splice(i, 1);
            }
        }

        let jsonString = JSON.stringify(tasks);
        localStorage.setItem(key, jsonString);
    }
}

function clearTaskListAll() {
    localStorage.removeItem(key);
    tasks.length = 0;

    let taskList = document.getElementById('listTask');

    while(taskList.firstChild) {
        taskList.removeChild( taskList.firstChild );
    }
}

function filter() {
    let selectFilter = document.getElementById('selectFilter');
    let selectOption = selectFilter.options[selectFilter.selectedIndex].value;

    if (selectOption == 1) {
        showTaskList();
        console.log(tasks);
    } else if (selectOption == 2) {
        filterChecked();
        console.log(tasks);
    } else filterUnchecked();
}

function filterChecked() {
    let taskList = document.getElementById('listTask');

    while(taskList.firstChild) {
        taskList.removeChild( taskList.firstChild );
    }

    let item = '';

    for(let i = 0; i < tasks.length; i++) {
        if (tasks[i][1].flag) {
            item += `<li class="list-group-item" id=${tasks[i][0].id}><strike>${i + 1}. ${tasks[i][1].task}</strike></li>`;
        }
    }
    taskList.insertAdjacentHTML('beforeend', item);
}

function filterUnchecked() {
    let taskList = document.getElementById('listTask');

    while(taskList.firstChild) {
        taskList.removeChild( taskList.firstChild );
    }

    let item = '';

    for(let i = 0; i < tasks.length; i++) {
        if (!tasks[i][1].flag) {
            item += `<li class="list-group-item" id=${tasks[i][0].id}>${i + 1}. ${tasks[i][1].task}</li>`;
        }
    }
    taskList.insertAdjacentHTML('beforeend', item);
}
