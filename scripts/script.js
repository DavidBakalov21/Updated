class Task {
  constructor(task, isDone, time) {
    this.task = task;
    this.time = time;
    this.isDone = isDone;
  }
  toggleDone(elId, stateT) {
    if (elId.style.backgroundColor == "green") {
      elId.style.backgroundColor = "white";
      stateT.textContent = "Not Completed";
    } else {
      elId.style.backgroundColor = "green";
      stateT.textContent = "Completed";
    }

    this.isDone = !this.isDone;
  }
  ShowEdit(id) {
    id.style.display = "flex";
  }
  Edit(Input, taskBox, container) {
    let InText = Input.value;
    // divs.style.display = 'none';

    let currentDate = new Date();
    taskBox.tasks = taskBox.tasks.filter((t) => t != this);

    var oldTaskCard = document.getElementById("TaskCont_" + this.task);
    oldTaskCard.parentNode.removeChild(oldTaskCard);

    let newTask = new Task(InText, false, currentDate);
    taskBox.addTask(newTask);
    let newTaskCard = document.getElementById("TaskCont").cloneNode(true);
    let newState = newTaskCard.querySelector("h4");
    let newInput = newTaskCard.querySelector("input");
    newInput.id = "InputEdit" + InText;
    newTaskCard.style.display = "flex";
    newTaskCard.id = "TaskCont_" + InText;
    let divsNew = newTaskCard.querySelectorAll("div");

    divsNew[0].addEventListener("click", () =>
      newTask.toggleDone(newTaskCard, newState)
    );
    divsNew[0].addEventListener("dblclick", () => newTask.ShowEdit(divsNew[2]));

    let newTime = newTaskCard.querySelector("p");
    newTime.textContent = currentDate;

    let newText = newTaskCard.querySelector("h3");
    newText.textContent = InText;

    let buttons = newTaskCard.querySelectorAll("button");
    buttons[0].addEventListener("click", () =>
      taskBox.removeTask(newTask, newTaskCard)
    );
    buttons[1].addEventListener("click", () =>
      newTask.Edit(newInput, taskBox, container)
    );

    container.appendChild(newTaskCard);
  }
}

class TodoItemPremium extends Task {
  constructor(task, isDone, time, img) {
    super(task, isDone, time);

    this.img = img;
  }

  EditPrem(Input, taskBox, container) {
    taskBox.tasks = taskBox.tasks.filter((t) => t != this);

    var oldTaskCard = document.getElementById("TaskCont_" + this.task);
    oldTaskCard.parentNode.removeChild(oldTaskCard);
    let tasktext = Input.value;
    // divs.style.display = 'none';

    let currentDate = new Date();
    var task = new TodoItemPremium(
      tasktext,
      false,
      currentDate,
      "https://cdn-icons-png.flaticon.com/512/4345/4345573.png"
    );
    taskBox.addTask(task);
    var container = document.getElementById("cont");
    var newTaskInfo = document.getElementById("TaskContPrem").cloneNode(true);
    var state = newTaskInfo.querySelector("h4");
    var Input = newTaskInfo.querySelector("input");
    newTaskInfo.querySelector("img").src = task.img;

    Input.id = "InputEdit" + tasktext;
    newTaskInfo.style.display = "flex";
    newTaskInfo.id = "TaskCont_" + tasktext;

    var divs = newTaskInfo.querySelectorAll("div");
    divs[0].addEventListener("click", () =>
      task.toggleDone(newTaskInfo, state)
    );
    // divs[2].id="Edit_"+taskBox;
    divs[0].addEventListener("dblclick", () => task.ShowEdit(divs[2]));
    //divs[2].

    var Time = newTaskInfo.querySelector("p");
    Time.textContent = currentDate;
    var Text = newTaskInfo.querySelector("h3");
    Text.textContent = tasktext;
    var buttons = newTaskInfo.querySelectorAll("button");
    buttons[0].addEventListener("click", () =>
      taskBox.removeTask(task, newTaskInfo)
    );
    buttons[1].addEventListener("click", () =>
      task.EditPrem(Input, taskBox, container)
    );

    container.appendChild(newTaskInfo);
  }
}

class BoxTasks {
  constructor(tasks) {
    this.tasks = tasks;
  }
  addTask(task) {
    this.tasks.push(task);
  }

  removeTask(task, TaskId) {
    TaskId.parentNode.removeChild(TaskId);

    this.tasks = this.tasks.filter((Dtask) => Dtask != task);
    // alert(this.tasks.length);
  }

  removeCompleted() {
    this.tasks = this.tasks.filter((task) => {
      if (task.isDone) {
        var elementId = "TaskCont_" + task.task;
        var element = document.getElementById(elementId);
        element.parentNode.removeChild(element);
      }
      return !task.isDone;
    });
  }

  removeAll() {
    if (checkDone() == true) {
      var Sure = prompt("Are U sure? Y/N");
      if (Sure == "Y") {
        var container = document.getElementById("cont");
        container.innerHTML = "";
        this.tasks = [];
      }
    } else {
      var container = document.getElementById("cont");
      container.innerHTML = "";
      this.tasks = [];
    }
  }
}

let taskBox = new BoxTasks([]);

window.addEventListener("beforeunload", function () {
  console.log("Data before stringifying:", taskBox.tasks);
  localStorage.setItem("Tasks", JSON.stringify(taskBox.tasks));
});

document.addEventListener("DOMContentLoaded", () => {
  let data = localStorage.getItem("Tasks");
  let parsedJs = JSON.parse(data);
  for (let index = 0; index < parsedJs.length; index++) {
    let parsedData = parsedJs[index];
    console.log(Object.keys(parsedData).length);
    console.log(parsedData.task);
    if (Object.keys(parsedData).length < 4) {
      let task = new Task(parsedData.task, parsedData.isDone, parsedData.time);
      taskBox.addTask(task);
      let container = document.getElementById("cont");
      let newTaskInfo = document.getElementById("TaskCont").cloneNode(true);
      let state = newTaskInfo.querySelector("h4");
      let Input = newTaskInfo.querySelector("input");
      Input.id = "InputEdit" + parsedData.task;
      newTaskInfo.style.display = "flex";
      newTaskInfo.id = "TaskCont_" + parsedData.task;

      let divs = newTaskInfo.querySelectorAll("div");
      divs[0].addEventListener("click", () =>
        task.toggleDone(newTaskInfo, state)
      );
      divs[0].addEventListener("dblclick", () => task.ShowEdit(divs[2]));

      let Time = newTaskInfo.querySelector("p");
      Time.textContent = parsedData.time;
      let Text = newTaskInfo.querySelector("h3");
      Text.textContent = parsedData.task;
      let buttons = newTaskInfo.querySelectorAll("button");
      buttons[0].addEventListener("click", () =>
        taskBox.removeTask(task, newTaskInfo)
      );
      buttons[1].addEventListener("click", () =>
        task.Edit(Input, taskBox, container)
      );

      container.appendChild(newTaskInfo);
    } else {
      //let currentDate = new Date();
      let task = new TodoItemPremium(
        parsedData.task,
        parsedData.isDone,
        parsedData.time,
        parsedData.img
      );
      taskBox.addTask(task);
      let container = document.getElementById("cont");
      let newTaskInfo = document.getElementById("TaskContPrem").cloneNode(true);
      let state = newTaskInfo.querySelector("h4");
      let Input = newTaskInfo.querySelector("input");
      newTaskInfo.querySelector("img").src = parsedData.img;

      Input.id = "InputEdit" + parsedData.task;
      newTaskInfo.style.display = "flex";
      newTaskInfo.id = "TaskCont_" + parsedData.task;

      let divs = newTaskInfo.querySelectorAll("div");
      divs[0].addEventListener("click", () =>
        task.toggleDone(newTaskInfo, state)
      );
      // divs[2].id="Edit_"+taskBox;
      divs[0].addEventListener("dblclick", () => task.ShowEdit(divs[2]));
      //divs[2].

      let Time = newTaskInfo.querySelector("p");
      Time.textContent = parsedData.time;
      let Text = newTaskInfo.querySelector("h3");
      Text.textContent = parsedData.task;
      let buttons = newTaskInfo.querySelectorAll("button");
      buttons[0].addEventListener("click", () =>
        taskBox.removeTask(task, newTaskInfo)
      );
      buttons[1].addEventListener("click", () =>
        task.EditPrem(Input, taskBox, container)
      );

      container.appendChild(newTaskInfo);
    }
  }

  console.log(data);
});
function checkDone() {
  for (let index = 0; index < taskBox.tasks.length; index++) {
    if (taskBox.tasks[index].isDone == false) {
      return true;
    }
  }
}

function rightNow() {
  var Rand = Math.floor(Math.random() * taskBox.tasks.length);
  let elementId = "TaskCont_" + taskBox.tasks[Rand].task;
  let element = document.getElementById(elementId);
  element.style.backgroundColor = "red";
}
function DeleteDone() {
  taskBox.removeCompleted();
}
function clearStorage() {
  localStorage.clear();
  taskBox.tasks = [];
  console.log(localStorage.getItem("Tasks"));
  console.log(taskBox.tasks);
  location.reload();
}

function DeleteAll() {
  taskBox.removeAll();
}
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    var elements = document.getElementsByClassName("Editor");
    for (var i = 0; i < elements.length; i++) {
      elements[i].style.display = "none";
    }
  }
});
function Add() {
  var tasktext = document.getElementById("inputTask").value;
  if (tasktext.length > 0) {
    let currentDate = new Date();
    var task = new Task(tasktext, false, currentDate);
    taskBox.addTask(task);
    var container = document.getElementById("cont");
    var newTaskInfo = document.getElementById("TaskCont").cloneNode(true);
    var state = newTaskInfo.querySelector("h4");
    var Input = newTaskInfo.querySelector("input");
    Input.id = "InputEdit" + tasktext;
    newTaskInfo.style.display = "flex";
    newTaskInfo.id = "TaskCont_" + tasktext;

    var divs = newTaskInfo.querySelectorAll("div");
    divs[0].addEventListener("click", () =>
      task.toggleDone(newTaskInfo, state)
    );
    // divs[2].id="Edit_"+taskBox;
    divs[0].addEventListener("dblclick", () => task.ShowEdit(divs[2]));
    //divs[2].

    var Time = newTaskInfo.querySelector("p");
    Time.textContent = currentDate;
    var Text = newTaskInfo.querySelector("h3");
    Text.textContent = tasktext;
    var buttons = newTaskInfo.querySelectorAll("button");
    buttons[0].addEventListener("click", () =>
      taskBox.removeTask(task, newTaskInfo)
    );
    buttons[1].addEventListener("click", () =>
      task.Edit(Input, taskBox, container)
    );

    container.appendChild(newTaskInfo);
  } else {
    alert("bad");
  }
}

function AscendingDescending() {
  var changeElement = document.getElementById("cont");
  var button = document.getElementById("VeryImportantButton");
  if (changeElement.style.flexDirection == "column") {
    changeElement.style.flexDirection = "column-reverse";
    button.textContent = "Ascending";
  } else {
    changeElement.style.flexDirection = "column";
    button.textContent = "Descending";
  }
}
var ascendingDescendin = 0;
function SortedArray() {
  let arraySort = taskBox.tasks;
  if (ascendingDescendin == 0) {
    arraySort.sort((one, two) => {
      let d1 = new Date(one.time);
      let d2 = new Date(two.time);
      return d1 - d2;
    });
    ascendingDescendin = 1;
  } else {
    arraySort.sort((one, two) => {
      let d1 = new Date(one.time);
      let d2 = new Date(two.time);
      return d2 - d1;
    });
    ascendingDescendin = 0;
  }

  let arrayString = arraySort.map((task) => `{${task.task} -${task.time}}`);
  document.getElementById("placePrint").textContent = arrayString;
}
function AddPremium() {
  var tasktext = document.getElementById("inputTask").value;
  if (tasktext.length > 0) {
    let currentDate = new Date();
    var task = new TodoItemPremium(
      tasktext,
      false,
      currentDate,
      "https://cdn-icons-png.flaticon.com/512/4345/4345573.png"
    );
    taskBox.addTask(task);
    var container = document.getElementById("cont");
    var newTaskInfo = document.getElementById("TaskContPrem").cloneNode(true);
    var state = newTaskInfo.querySelector("h4");
    var Input = newTaskInfo.querySelector("input");
    newTaskInfo.querySelector("img").src = task.img;

    Input.id = "InputEdit" + tasktext;
    newTaskInfo.style.display = "flex";
    newTaskInfo.id = "TaskCont_" + tasktext;

    var divs = newTaskInfo.querySelectorAll("div");
    divs[0].addEventListener("click", () =>
      task.toggleDone(newTaskInfo, state)
    );
    // divs[2].id="Edit_"+taskBox;
    divs[0].addEventListener("dblclick", () => task.ShowEdit(divs[2]));
    //divs[2].

    var Time = newTaskInfo.querySelector("p");
    Time.textContent = currentDate;
    var Text = newTaskInfo.querySelector("h3");
    Text.textContent = tasktext;
    var buttons = newTaskInfo.querySelectorAll("button");
    buttons[0].addEventListener("click", () =>
      taskBox.removeTask(task, newTaskInfo)
    );
    buttons[1].addEventListener("click", () =>
      task.EditPrem(Input, taskBox, container)
    );

    container.appendChild(newTaskInfo);
  } else {
    alert("bad");
  }
}
