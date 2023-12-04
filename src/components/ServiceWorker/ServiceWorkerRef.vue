<script>
export default {
  name: "App-old",

  data: () => ({
    database: null,
    todos: [],
    newTodo: "",
    editedTodo: null,
    visibility: "all",
  }),

  computed: {
    activeTasks() {
      return this.todos.filter((todo) => !todo.completed);
    },
    filteredTodos() {
      if (this.visibility === "all") {
        return this.todos;
      } else if (this.visibility === "active") {
        return this.activeTasks;
      } else {
        return this.todos.filter((todo) => todo.completed);
      }
    },
    remaining() {
      return this.activeTasks.length;
    },
    allDone: {
      get() {
        return this.remaining === 0;
      },
      set(value) {
        this.todos.forEach((todo) => {
          todo.completed = value;
          this.saveTodo({
            ...todo,
          });
        });
      },
    },
  },

  methods: {
    addTodo() {
      const value = this.newTodo && this.newTodo.trim();
      const todoItem = {
        id: this.todos.length + 1,
        title: value,
        completed: false,
      };

      if (!value) {
        return;
      }
      this.todos.push(todoItem);
      this.saveTodo(todoItem);
      this.newTodo = "";
    },

    cancelEdit(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    async deleteTodo(todo) {
      this.database = await this.getDatabase();

      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("todos", "readwrite");
        const store = transaction.objectStore("todos");

        store.delete(todo.id);

        transaction.oncomplete = () => {
          resolve("Tarea eliminada satisfactoriamente.");
        };

        transaction.onerror = (event) => {
          reject(event);
        };
      });
    },

    doneEdit(todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      this.saveTodo({
        ...todo,
        title: todo.title,
      });
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    editTodo(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    async getDatabase() {
      return new Promise((resolve, reject) => {
        if (this.database) {
          resolve(this.database);
        }

        let request = window.indexedDB.open("todoListDB", 1);

        request.onerror = (event) => {
          console.error("ERROR: Unable to open database", event);
          reject("Error");
        };

        request.onsuccess = (event) => {
          this.database = event.target.result;
          resolve(this.database);
        };

        request.onupgradeneeded = (event) => {
          let database = event.target.result;
          database.createObjectStore("todos", {
            autoIncrement: true,
            keyPath: "id",
          });
        };
      });
    },

    async getTodoStore() {
      this.database = await this.getDatabase();

      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("todos", "readonly");
        const store = transaction.objectStore("todos");

        let todoList = [];

        store.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            todoList.push(cursor.value);
            cursor.continue();
          }
        };

        transaction.oncomplete = () => {
          resolve(todoList);
        };

        transaction.onerror = (event) => {
          reject(event);
        };
      });
    },

    pluralize(word, count) {
      return word + (count === 1 ? "" : "s");
    },

    removeCompleted() {
      this.todos = this.todos.filter((item) => {
        if (item.completed) {
          this.deleteTodo(item);
        } else {
          return !item.completed;
        }
      });
    },

    removeTodo(todo) {
      const index = this.todos.indexOf(todo);
      this.todos.splice(index, 1);
      this.deleteTodo(todo);
    },

    async saveTodo(todo) {
      this.database = await this.getDatabase();

      return new Promise((resolve, reject) => {
        const transaction = this.database.transaction("todos", "readwrite");
        const store = transaction.objectStore("todos");

        store.put(todo);

        transaction.oncomplete = () => {
          resolve("Item successfully saved.");
        };

        transaction.onerror = (event) => {
          reject(event);
        };
      });
    },

    updateTodo(todo) {
      this.todos.find((item) => item === todo).completed = !todo.completed;
      this.saveTodo({
        ...todo,
      });
    },
  },
  async created() {
    this.todos = await this.getTodoStore();
  },
};
</script>

<template>
  <section class="todoapp">
    <header class="header">
      <input
        class="new-todo"
        autofocus
        autocomplete="off"
        placeholder="Qué pendientes hay por hacer?"
        v-model="newTodo"
        @keyup.enter="addTodo"
      />
    </header>
    <section class="main" v-show="todos.length">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        v-model="allDone"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <li
          class="todo"
          v-for="todo in filteredTodos"
          :key="todo.id"
          :class="{ completed: todo.completed, editing: todo == editedTodo }"
        >
          <div class="view">
            <input
              class="toggle"
              type="checkbox"
              @click="updateTodo(todo)"
              :checked="todo.completed"
            />
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input
            class="edit"
            type="text"
            v-model="todo.title"
            @blur="doneEdit(todo)"
            @keyup.enter="doneEdit(todo)"
            @keyup.esc="cancelEdit(todo)"
          />
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong v-text="remaining"></strong>
        {{ pluralize("item", remaining) }} pendiente
      </span>
      <ul class="filters">
        <li>
          <button
            @click="visibility = 'all'"
            :class="{ selected: visibility == 'all' }"
            class="btn"
          >
            Todas
          </button>
        </li>
        <li>
          <button
            @click="visibility = 'active'"
            :class="{ selected: visibility == 'active' }"
            class="btn"
          >
            Pendientes
          </button>
        </li>
        <li>
          <button
            @click="visibility = 'completed'"
            :class="{ selected: visibility == 'completed' }"
            class="btn"
          >
            Completadas
          </button>
        </li>
      </ul>
      <button
        class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining"
      >
        Eliminar Completadas
      </button>
    </footer>
  </section>

  <footer class="info">
    <p>Softstoic</p>
  </footer>
</template>

<style>
.todoapp {
  background: #fff;
  margin: 30px 0 40px 0;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
  width: 800px;
}

.todoapp input::-webkit-input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp input::-moz-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp input::input-placeholder {
  font-style: italic;
  font-weight: 300;
  color: #e6e6e6;
}

.todoapp h1 {
  position: absolute;
  top: -155px;
  width: 100%;
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47);
  -webkit-text-rendering: optimizeLegibility;
  -moz-text-rendering: optimizeLegibility;
  text-rendering: optimizeLegibility;
}

.new-todo,
.edit {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.new-todo {
  padding: 16px 16px 16px 60px;
  border: none;
  background: rgba(0, 0, 0, 0.003);
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}

.main {
  position: relative;
  z-index: 2;
  border-top: 1px solid #e6e6e6;
}

.toggle-all {
  text-align: center;
  border: none; /* Mobile Safari */
  opacity: 0;
  position: absolute;
}

.toggle-all + label {
  width: 60px;
  height: 34px;
  font-size: 0;
  position: absolute;
  top: -52px;
  left: -13px;
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
}

.toggle-all + label:before {
  content: "❯";
  font-size: 22px;
  color: #e6e6e6;
  padding: 10px 27px 10px 27px;
}

.toggle-all:checked + label:before {
  color: #737373;
}

.todo-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.todo-list li {
  position: relative;
  font-size: 24px;
  border-bottom: 1px solid #ededed;
}

.todo-list li:last-child {
  border-bottom: none;
}

.todo-list li.editing {
  border-bottom: none;
  padding: 0;
}

.todo-list li.editing .edit {
  display: block;
  width: 506px;
  padding: 12px 16px;
  margin: 0 0 0 43px;
}

.todo-list li.editing .view {
  display: none;
}

.todo-list li .toggle {
  text-align: center;
  width: 40px;
  /* auto, since non-WebKit browsers doesn't support input styling */
  height: auto;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  margin: auto 0;
  border: none; /* Mobile Safari */
  -webkit-appearance: none;
  appearance: none;
}

.todo-list li .toggle {
  opacity: 0;
}

.todo-list li .toggle + label {
  /*
		Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
		IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
	*/
  background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center left;
}

.todo-list li .toggle:checked + label {
  background-image: url("data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E");
}

.todo-list li label {
  word-break: break-all;
  padding: 15px 15px 15px 60px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
}

.todo-list li.completed label {
  color: #d9d9d9;
  text-decoration: line-through;
}

.todo-list li .destroy {
  display: none;
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #cc9a9a;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
}

.todo-list li .destroy:hover {
  color: #af5b5e;
}

.todo-list li .destroy:after {
  content: "×";
}

.todo-list li:hover .destroy {
  display: block;
}

.todo-list li .edit {
  display: none;
}

.todo-list li.editing:last-child {
  margin-bottom: -1px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #777;
  padding: 10px 15px;
  height: 50px;
  text-align: center;
  border-top: 1px solid #e6e6e6;
  width: 100%;
}

.footer:before {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 50px;
  overflow: hidden;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2), 0 8px 0 -3px #f6f6f6,
    0 9px 1px -3px rgba(0, 0, 0, 0.2), 0 16px 0 -6px #f6f6f6,
    0 17px 2px -6px rgba(0, 0, 0, 0.2);
}

.todo-count {
  float: left;
  text-align: left;
}

.todo-count strong {
  font-weight: 300;
}

.filters {
  margin: 0;
  padding: 0;
  list-style: none;
  position: absolute;
  right: 0;
  left: 0;
}

.filters li {
  display: inline;
}

.filters li button {
  color: inherit;
  margin: 3px;
  padding: 3px 7px;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: 3px;
}

.filters li button:hover {
  border-color: rgba(175, 47, 47, 0.1);
}

.filters li button.selected {
  border-color: rgba(175, 47, 47, 0.2);
}

.clear-completed,
html .clear-completed:active {
  float: right;
  position: relative;
  line-height: 20px;
  text-decoration: none;
  cursor: pointer;
}

.clear-completed:hover {
  text-decoration: underline;
}

.info {
  margin: 65px auto 0;
  color: #bfbfbf;
  font-size: 10px;
  text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);
  text-align: center;
}

.info p {
  line-height: 1;
}

.info a {
  color: inherit;
  text-decoration: none;
  font-weight: 400;
}

.info a:hover {
  text-decoration: underline;
}

/*
	Hack to remove background from Mobile Safari.
	Can't use it globally since it destroys checkboxes in Firefox
*/
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .toggle-all,
  .todo-list li .toggle {
    background: none;
  }

  .todo-list li .toggle {
    height: 40px;
  }
}

@media (max-width: 430px) {
  .footer {
    height: 50px;
  }

  .filters {
    bottom: 10px;
  }
}

@media screen and (max-width: 800px) {
  .footer {
    max-width: 500px;
  }
  .filters {
    flex-direction: column;
  }
}
</style>
