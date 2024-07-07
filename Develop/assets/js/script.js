$(document).ready(function () {
    const taskForm = $('#taskForm');
    const taskContainer = $('#taskContainer');
    const taskDescription = $('#taskDescription');
    const dueDate = $('#dueDate');
  
    function getTasks() {
      return JSON.parse(localStorage.getItem('tasks')) || [];
    }
  
    function saveTasks(tasks) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function addTaskToDOM(task) {
      const taskElement = $(`
        <div class="card mb-3 task" data-id="${task.id}" data-status="${task.status}">
          <div class="card-body">
            <h5 class="card-title">${task.description}</h5>
            <p class="card-text">Due: ${task.dueDate}</p>
            <button class="btn btn-danger delete-task-btn">Delete</button>
          </div>
        </div>
      `);
  
      const deadline = dayjs(task.dueDate);
      const now = dayjs();
      if (deadline.isBefore(now, 'day')) {
        taskElement.addClass('bg-danger text-white');
      } else if (deadline.diff(now, 'day') < 3) {
        taskElement.addClass('bg-warning');
      }
  
      $(`#${task.status}-cards`).append(taskElement);
    }
  
    function renderTasks() {
      const tasks = getTasks();
      $('.task-lane').empty();
      tasks.forEach(task => addTaskToDOM(task));
    }
  
    function updateTaskStatus(taskId, newStatus) {
      const tasks = getTasks();
      const task = tasks.find(t => t.id === taskId);
      task.status = newStatus;
      saveTasks(tasks);
    }

    taskForm.on('submit', function (e) {
      e.preventDefault();
      const description = taskDescription.val();
      const due = dueDate.val();
      const task = {
        id: Date.now(),
        description,
        dueDate: due,
        status: 'to-do'
      };
  
      const tasks = getTasks();
      tasks.push(task);
      saveTasks(tasks);
      addTaskToDOM(task);
      taskForm[0].reset();
    });

    $(document).on('click', '.delete-task-btn', function () {
      const taskElement = $(this).closest('.task');
      const taskId = taskElement.data('id');
      let tasks = getTasks();
      tasks = tasks.filter(task => task.id !== taskId);
      saveTasks(tasks);
      taskElement.remove();
    });
  
    $('.task-lane').sortable({
      connectWith: '.task-lane',
      receive: function (event, ui) {
        const taskId = ui.item.data('id');
        const newStatus = $(this).attr('id').replace('-cards', '');
        updateTaskStatus(taskId, newStatus);
      }
    }).disableSelection();
  
    renderTasks();
  });

  
// Retrieve tasks and nextId from localStorage
// Todo: create a function to generate a unique task id
// Todo: create a function to create a task card
// Todo: create a function to render the task list and make cards draggable
// Todo: create a function to handle adding a new task
// Todo: create a function to handle deleting a task
// Todo: create a function to handle dropping a task into a new status lanec
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker