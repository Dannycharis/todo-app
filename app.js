// Model, View, Controller
(function () {
  const TodoModel = {
    todos: [],
    loadTodos() {
      const data = localStorage.getItem("todoList");
      this.todos = JSON.parse(data) || [];
    },

    saveTodos() {
      localStorage.setItem("todoList", JSON.stringify(this.todos));
    },
  };

  const TodoView = {
    todoList: document.getElementById("todo-list"),

    createTodoElement(todo) {
      const li = document.createElement("li");
      li.dataset.id = todo.id;
      if (todo.completed) {
        li.classList.add("completed");
      }

      li.innerHTML = `<span>${todo.text}</span><button class='delete-btn'>X</button>`;
      return li;
    },

    render() {
      this.todoList.innerHTML = "";
      TodoModel.todos.forEach((todo) => {
        this.todoList.appendChild(this.createTodoElement(todo));
      });
    },
  };

  const TodoController = {
    todoInput: document.getElementById("todo-input"),
    addBtn: document.getElementById("add-btn"),
    init() {
      // Load tasks from LocalStorage
      TodoModel.loadTodos();

      // Render tasks to the UI
      TodoView.render();

      // Listen For Events
      this.addBtn.addEventListener("click", this.addTodo.bind(this));
      this.todoInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          this.addTodo();
        }
      });
      TodoView.todoList.addEventListener("click", this.deleteTodo.bind(this));
      TodoView.todoList.addEventListener(
        "click",
        this.toggleCompleted.bind(this)
      );
    },
    addTodo() {
      const text = this.todoInput.value.trim();

      if (!text) {
        alert("Please enter a task!");
        return;
      }

      const newTask = {
        id: Date.now(),
        text,
        completed: false,
      };
      TodoModel.todos.push(newTask);
      TodoModel.saveTodos();
      TodoView.render();

      // Clear input field
      this.todoInput.value = "";
      this.todoInput.focus();
    },

    deleteTodo(e) {
      // Prevent Relaod
      e.preventDefault();

      // Guard Clause
      if (!e.target.classList.contains("delete-btn")) return;

      // Get id of task item to be deleted
      const id = Number(e.target.closest("li").dataset.id);

      // Find the index of the target task
      const index = TodoModel.todos.findIndex((todo) => todo.id === id);

      // Delete task
      TodoModel.todos.splice(index, 1);

      // Refresh the array
      TodoModel.saveTodos();
      TodoView.render();
    },

    toggleCompleted(e) {
      e.preventDefault();

      // Guard Clause
      if (!e.target.closest("li")) return;

      // Get task
      const li = e.target.closest("li");

      // // Toggle Completed
      // li.classList.toggle("completed");

      const todo = TodoModel.todos.find(
        (todo) => todo.id === Number(li.dataset.id)
      );

      // Toggle Completed
      todo.completed = !todo.completed;
      TodoModel.saveTodos();
      TodoView.render();
    },
  };
  TodoController.init();
})();
