'use strict'

let tasks = [];

const key = "tasksString";
const listOfTasks = document.getElementById('listTask');
const selectFilter = document.getElementById('selectFilter');
const inputTask = document.getElementById('inputTask');
const dropdownBtn = document.getElementById('dropdown-Btn');
const paginator = document.getElementById('paginator');
const btnShowAll = document.getElementById('btnShowAll');
const btnShowCheck = document.getElementById('btnShowCheck');
const btnShowUncheck = document.getElementById('btnShowUncheck');
const btnAddTask = document.getElementById('formBtnAddTask');
const selectColor = document.getElementById('selectChooseColor');
const btnDeleteAllTasks = document.getElementById('btnDeleteAllTasks');
const btnDeleteCheckedTasks = document.getElementById('btnDeleteCheckedTasks');
const modalDeleteAllTasks = document.getElementById('modalDeleteAllTasks');
const modalDeleteCheckedTasks = document.getElementById('modalDeleteCheckedTasks');
const modalBtnDeleteAllTasks = document.getElementById('modalBtnDeleteAllTasks');
const modalBtnDeleteCheckedTasks = document.getElementById('modalBtnDeleteCheckedTasks');

let pageCount = 0;
let page = 1;
let flagChecked;
let flagUnchecked;
let colorOfTask = 'black';
dropdownBtn.style.color = 'white';
btnShowAll.classList.add('active');

const pageTask = 5;
const colorSet = [
	{ eng: 'black', rus: 'Чёрный' },
	{ eng: 'red', rus: 'Красный' },
	{ eng: 'blue', rus: 'Синий' },
	{ eng: 'green', rus: 'Зелёный' },
	{ eng: 'purple', rus: 'Фиолетовый' },
]

initializationDropdownBtnColor()
initializationLocalStorage();
showTaskList(1);

function initializationLocalStorage() {
	if (localStorage.getItem(key) !== null) {
		tasks = JSON.parse(localStorage.getItem(key));
	}
}

function initializationDropdownBtnColor() {
	selectColor.innerHTML = '';
	let dropdownSet = '';
	for (let i = 0; i < colorSet.length; i++) {
		dropdownSet += `<li><a class="dropdown-item" href="#" data-color="${colorSet[i].eng}">${colorSet[i].rus}</a></li>`
	}
	selectColor.insertAdjacentHTML('beforeend', dropdownSet);
}

function changeColorOfTask(currentColor, idTask) {
	let elementNumber = tasks.findIndex(item => item.id === idTask);
	let newColor = colorSet.findIndex(item => item.eng === currentColor);
	newColor++;

	if ((newColor < colorSet.length) && (newColor !== 0)) {
		tasks[elementNumber].color = colorSet[newColor].eng;
	} else {
		tasks[elementNumber].color = colorSet[0].eng;
	}

	refreshLocalStorage();
	showTaskList(page);
}

function chooseColorOfTask(color) {
	colorOfTask = color;
	dropdownBtn.style.color = color;
}

selectColor.addEventListener('click', function (e) {
	if (e.target.tagName === 'A') {
		chooseColorOfTask(e.target.dataset.color);
	}
})

function refreshLocalStorage() {
	let jsonString = JSON.stringify(tasks);
	localStorage.setItem(key, jsonString);
}

selectFilter.addEventListener('click', function (e) {
	let id = e.target.closest('BUTTON').id;
	filter(id);
})

listOfTasks.addEventListener('click', function (e) {
	if ((e.target.tagName === 'LI') || (e.target.tagName === 'STRIKE')) {
		let id = e.target.closest('LI').id;
		let checkedTask = tasks.findIndex(item => item.id === id);

		tasks[checkedTask].flag = !tasks[checkedTask].flag;

		refreshLocalStorage();
		showTaskList(page);
	}
	if ((e.target.tagName === 'BUTTON') || (e.target.tagName === 'I')) {
		if (e.target.closest('BUTTON').className === 'btn btn-primary js-changeColor') {
			changeColorOfTask(e.target.closest('BUTTON').dataset.color, e.target.closest('BUTTON').dataset.idTask);
		}

		if (e.target.closest('BUTTON').className === 'btn btn-outline-primary js-editTask') {
			editTask(e.target.closest('BUTTON').dataset.idTask);
		}

		if (e.target.closest('BUTTON').className === 'btn btn-outline-primary js-deleteOneTask') {
			deleteOneTask(e.target.closest('BUTTON').dataset.idTask);
		}
	}
})

paginator.addEventListener('click', function (e) {
	if (((e.target.tagName === 'LI') || (e.target.tagName === 'A') || (e.target.tagName === 'SPAN')) 
	&& (e.target.closest('LI').className !== 'page-item disabled') && (e.target.closest('A').id !== null)) {
		switch (e.target.closest('A').id) {
			case 'previous':
				previousPage(Number(e.target.closest('A').dataset.pageCount));
				break;
			case 'first':
				showTaskList(1);
				break;
			case 'next':
				nextPage(Number(e.target.closest('A').dataset.pageCount));
				break;
			case 'last':
				showTaskList(Number(e.target.closest('A').dataset.pageCount));
				break;
		}
	}
})

btnAddTask.addEventListener('click', function (e) {
	e.preventDefault();
	getNewItem();
	pageCount = Math.ceil(tasks.length / pageTask);
	if (!flagUnchecked) {
		filter('btnShowAll', pageCount);
	} else { 
		filter('btnShowUncheck', pageCount);	
	}
})

btnDeleteAllTasks.addEventListener('click', function () {
	if (tasks.length !== 0) {
		let modal = new bootstrap.Modal(modalDeleteAllTasks, {
			keyboard: false
		});
		modal.show()
	}
})

btnDeleteCheckedTasks.addEventListener('click', function () {
	let checkedArray = tasks.filter(item => item.flag === true);
	if (checkedArray.length !== 0) {
		let modal = new bootstrap.Modal(modalDeleteCheckedTasks, {
			keyboard: false
		});
		modal.show()
	}
})

modalBtnDeleteAllTasks.addEventListener('click', function () {
	deleteTaskAll();
})

modalBtnDeleteCheckedTasks.addEventListener('click', function () {
	deleteTaskChecked();
})

function deleteTaskChecked() {
	clearTaskListChecked();
	if (!flagChecked && !flagUnchecked) {
		if (pageCount < page) {
			showTaskList(pageCount)
		} else {
			showTaskList(page)
		}
	} else if (flagUnchecked) {
		showTaskList(page);
	} else if (flagChecked) {
		showTaskList(1);
	}
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
	pageCount = Math.ceil(countTask / pageTask);

	if (countTask > pageTask) {
		switch (page) {
			case 1:
				paginatorData =
					`<li class="page-item disabled"><a class="page-link">
                <span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item active"><a class="page-link">1</a></li>
                <li class="page-item"><a class="page-link">..</a></li>
                <li class="page-item"><a class="page-link" id="last" data-page-count="${pageCount}">${pageCount}</a></li> 
                <li class="page-item"><a class="page-link" id="next" data-page-count="${pageCount}">
                <span aria-hidden="true">&raquo;</span></a></li>`;
				break;
			case pageCount:
				paginatorData =
					`<li class="page-item"><a class="page-link" id="previous" data-page-count="${pageCount}">
                <span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item"><a class="page-link" id="first">1</a></li>
                <li class="page-item"><a class="page-link">..</a></li>
                <li class="page-item active"><a class="page-link">${pageCount}</a></li>
                <li class="page-item disabled"><a class="page-link"><span aria-hidden="true">&raquo;</span></a></li>`
				break;
			default:
				paginatorData =
					`<li class="page-item"><a class="page-link" id="previous" data-page-count="${pageCount}">
                <span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item"><a class="page-link" id="first">1</a></li>
                <li class="page-item active"><a class="page-link">${page}</a></li>
                <li class="page-item"><a class="page-link" id="last" data-page-count="${pageCount}">${pageCount}</a></li>
                <li class="page-item"><a class="page-link" id="next" data-page-count="${pageCount}">
                <span aria-hidden="true">&raquo;</span></a></li>`;
				break;
		}
	} else {
		paginatorData = `<li class="page-item disabled">
                <a class="page-link" aria-disabled="true"><span aria-hidden="true">&laquo;</span></a></li>
                <li class="page-item active"><a class="page-link">1</a></li>
                <li class="page-item disabled"><a class="page-link"><span aria-hidden="true">&raquo;</span></a></li>`;
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
			filteredArray = tasks.filter(item => item.flag);
			break;
		case flagUnchecked:
			filteredArray = tasks.filter(item => !item.flag);
			break;
		default:
			filteredArray = tasks;
			break;
	}
	tasks.forEach(element => {
		if (element.flag) {
			checked++;
		}
		else unchecked++;
	});

	renderPagination(currentPage, filteredArray.length);
	if (pageCount < page && filteredArray.length !== 0) currentPage = pageCount;

	for (let i = currentPage * 5 - 5; ((i < currentPage * 5) && (i < filteredArray.length)); i++) {
		if (filteredArray[i].flag === true) {
			taskSet += `<div class="row mt-2 justify-content-between"><div class="col-12 col-lg-7 col-xl-8 text-end"><li class="list-group-item text-start" id=
                ${filteredArray[i].id} style="color:${filteredArray[i].color}"><strike>${i + 1}. ${filteredArray[i].task}</strike></li></div>`;
		} else {
			taskSet += `<div class="row mt-2 justify-content-between"><div class="col-12 col-lg-7 col-xl-8 text-end"><li class="list-group-item text-start" id=
                ${filteredArray[i].id} style="color:${filteredArray[i].color}">${i + 1}. ${filteredArray[i].task}</li></div>`;
		}
		taskSet +=
			`<div class="col-1 my-3 my-lg-0">
                <button type="button" data-id-task="${filteredArray[i].id}" data-color="${filteredArray[i].color}" class="btn btn-primary js-changeColor">
                <i class="bi bi-palette"></i></button></div>
                <div class="col-11 my-3 col-lg-4 my-lg-0 col-xl-3 text-end"><div class="btn-group" role="group"><button type="button" data-id-task="${filteredArray[i].id}" 
                class="btn btn-outline-primary js-editTask">
                <i class="bi bi-pencil"></i>
                Редактировать</button>
                <button type="button" data-id-task="${filteredArray[i].id}" 
                class="btn btn-outline-primary js-deleteOneTask">
                <i class="bi bi-trash"></i> Удалить</button></div></div></div>`;
	}

	listOfTasks.insertAdjacentHTML('beforeend', taskSet);

	btnShowAll.textContent = 'Показать все (' + tasks.length + ')';
	btnShowCheck.textContent = 'Выполненные (' + checked + ')';
	btnShowUncheck.textContent = 'Невыполненные (' + unchecked + ')';
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

function filter(id, innerPage) {
	btnShowCheck.classList.remove('active');
	btnShowUncheck.classList.remove('active');
	btnShowAll.classList.remove('active');

	flagChecked = false;
	flagUnchecked = false;
	let outerPage = 1;
	if (innerPage !== undefined) outerPage = innerPage; 

	switch (id) {
		case btnShowAll.id:
			btnShowAll.classList.add('active');
			showTaskList(outerPage);
			break;
		case btnShowCheck.id:
			btnShowCheck.classList.add('active');
			flagChecked = true;
			showTaskList(outerPage);
			break;
		case btnShowUncheck.id:
			btnShowUncheck.classList.add('active');
			flagUnchecked = true;
			showTaskList(outerPage);
			break;
	}
}

function editTask(idTask) {
	let editableTask = document.getElementById(idTask);

	let position = editableTask.textContent.indexOf(".") + 2;

	let editStr = editableTask.textContent.slice(position);

	if (editableTask.outerHTML) {
		editableTask.outerHTML = `<input type="text" id="inputEditTask" class="form-control" value="${editStr}"></input>`;
		let inputEditTask = document.getElementById('inputEditTask');
		setTimeout(function () { inputEditTask.selectionStart = inputEditTask.selectionEnd = 10000; }, 0);
		inputEditTask.focus();
		inputEditTask.addEventListener("keyup", function (e) {
			if (e.code === 'Enter') {
				if (inputEditTask.value !== '') {
					let idTaskInArray = tasks.findIndex(item => item.id === idTask.toString());
					tasks[idTaskInArray].task = inputEditTask.value;
					refreshLocalStorage();
				}
				showTaskList(page);
			}
		});
		inputEditTask.addEventListener("focusout", function () {
			if (inputEditTask.value !== '') {
				let idTaskInArray = tasks.findIndex(item => item.id === idTask.toString());
				tasks[idTaskInArray].task = inputEditTask.value;
				refreshLocalStorage();
			}
			showTaskList(page);
		});
	}
}

function deleteOneTask(idTask) {
	tasks = tasks.filter(function (item) {
		return (item.id !== idTask.toString());
	});
	refreshLocalStorage();
	if (pageCount < page) {
		showTaskList(pageCount)
	} else {
		showTaskList(page)
	}
}
