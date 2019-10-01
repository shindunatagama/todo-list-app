<template>
    <div>
        <section class="section">
            <div class="container">
                <div class="tags">
                    <span class="tag is-success">Total : {{todos.length || 0}}</span>
                    <span class="tag is-info">Complete : {{completedTodos.length || 0}}</span>
                    <span class="tag is-danger">Pending : {{pendingTodos.length || 0}}</span>
                </div>

                <div class="level-left">
                    <b-button class="is-primary" @click="isAddModalActive=true">
                        Add A Todo
                    </b-button>
                    &nbsp;
                    <b-button class="is-warning" @click="deleteAllTodos">
                        Delete All Todos
                    </b-button>
                    &nbsp;
                    <b-button class="is-dark" @click="downloadCSV">
                        Download as CSV
                    </b-button>
                </div>

                <div class="level-right">
                    <b-field>
                        <b-input placeholder="Search Title" v-model="search"></b-input>
                    </b-field>
                </div>

                <b-table 
                    :data="filteredTodos"
                    :columns="columns"
                    default-sort="priority">
                    <template slot-scope="todos">
                        <b-table-column label="">
                            <b-checkbox
                                v-model="todos.row.completed"
                                value="true"
                                unchecked-value="false"
                                @change.native="completeTodo(todos.row)">
                            </b-checkbox>
                        </b-table-column>

                        <b-table-column label="No">
                            {{todos.index + 1}}
                        </b-table-column>

                        <b-table-column field="title" label="Title" sortable>
                            {{ todos.row.title }}
                        </b-table-column>

                        <b-table-column field="id" label="ID" sortable>
                            {{ todos.row.id }}
                        </b-table-column>

                        <b-table-column field="note" label="Note" sortable>
                            {{ todos.row.note }}
                        </b-table-column>

                        <b-table-column field="priority" label="Priority" sortable>
                            <div class="priority-dot" :style="{background:todos.row.priorityColor}"></div>
                            <span>{{ todos.row.priority }}</span>
                        </b-table-column>

                        <b-table-column label="Action">
                            <b-button
                                type="is-info" outlined
                                icon-left="eye"
                                @click="openDetailModal(todos.row)">Detail
                            </b-button>
                            &nbsp;
                            <b-button
                                type="is-success" outlined
                                icon-left="pencil"
                                @click="openEditModal(todos.row)">Edit
                            </b-button>
                            &nbsp;
                            <b-button
                                type="is-danger" outlined
                                icon-left="delete"
                                @click="deleteTodo(todos.row)">Delete
                            </b-button>
                        </b-table-column>
                    </template>

                    <template slot="empty">
                        <section class="section">
                            <b-message type="is-info">
                                Nothing here
                            </b-message>
                        </section>
                    </template>
                </b-table>
            </div>
        </section>

        <b-modal :active.sync="isDetailModalActive" has-modal-card>
            <TodoDetailModal
                :todo="selectedTodo"
                :priorities="priorities">
            </TodoDetailModal>
        </b-modal>

        <b-modal :active.sync="isEditModalActive" has-modal-card>
            <TodoEditModal
                :todo="selectedTodo"
                :priorities="priorities"
                @edit-todo="onEditTodo">
            </TodoEditModal>
        </b-modal>

        <b-modal :active.sync="isAddModalActive" has-modal-card>
            <TodoAddModal
                :priorities="priorities"
                @add-todo="onAddTodo">
            </TodoAddModal>
        </b-modal>
    </div>
</template>

<script>
import TodoDetailModal from "@/components/TodoDetailModal";
import TodoEditModal from "@/components/TodoEditModal";
import TodoAddModal from "@/components/TodoAddModal";

import { saveAs } from 'file-saver';
import PapaParse from 'papaparse'

export default {
    name: "TodoTable",
    components: { TodoDetailModal, TodoEditModal, TodoAddModal },
    data() {
        return {
            columns: [
                { label: "Title" },
                { label: "ID" },
                { label: "Note" },
                { label: "Priority" },
                { label: "Action" }
            ],
            todos: [],
            priorities: [
                { id: 1, name: "High Priority" },
                { id: 2, name: "Medium Priority" },
                { id: 3, name: "Low Priority" }
            ],
            isDetailModalActive: false,
            isEditModalActive: false,
            isAddModalActive: false,
            selectedTodo: {},
            completedTodos: 0,
            pendingTodos: 0,
            search: ""
        };
    },
    mounted() {
        if (localStorage.getItem("todos")) {
            this.todos = JSON.parse(localStorage.getItem("todos"));
        }

        this.updateTodos();
    },
    computed: {
        filteredTodos() {
            return this.todos.filter(todo => {
                return todo.title.toLowerCase().includes(this.search.toLowerCase())
            })
        }
    },
    methods: {
        openDetailModal(todo) {
            this.selectedTodo = todo;
            this.isDetailModalActive = true;
        },
        openEditModal(todo) {
            this.selectedTodo = todo;
            this.isEditModalActive = true;
        },
        onAddTodo(item) {
            // get the highest number id to iterate on it
            var highestId = 0
            if (this.todos.length > 0) {
                highestId = Math.max.apply(Math, this.todos.map(item => item.id));
            }

            // set priority color
            var dotPriorityColor = "#11cdef";
            if (item.priority == "High Priority") {
                dotPriorityColor = "#f5365c";
            }
            else if (item.priority == "Medium Priority") {
                dotPriorityColor = "#ffbb33";
            }
            else if (item.priority == "Low Priority") {
                dotPriorityColor = "#5e72e4";
            }

            // Add the item to the array
            this.todos.push({
                id: highestId + 1,
                title: item.title,
                note: item.note,
                priority: item.priority,
                priorityColor: dotPriorityColor,
                completed: false
            });
            // save the updated array in localstorage
            this.saveLocalStorageTodos();
            this.updateTodos();
            this.isAddModalActive = false;
        },
        onEditTodo(item) {
            const todo = this.findTodo(item);
            // Apply the updated values
            todo.title = item.title;
            todo.note = item.note;
            todo.priority = item.priority;
            // save the updated array in localstorage
            this.saveLocalStorageTodos();
            // close the modal
            this.isEditModalActive = false;
        },
        deleteTodo(item) {
            this.$buefy.dialog.confirm({
                title: "Deleting Todo",
                confirmText: "Delete Todo",
                type: "is-danger",
                hasIcon: true,
                message: "Are you sure you want to delete this item? This cannot be undone.",
                onConfirm: () => {
                    // find in the array and remove
                    const index = this.todos.indexOf(item);
                    this.todos.splice(index, 1);
                    // save the updated array in localstorage
                    this.saveLocalStorageTodos();
                    this.updateTodos();
                }
            });
        },
        deleteAllTodos() {
            this.$buefy.dialog.confirm({
                title: "Deleting Todos",
                confirmText: "Delete Todos",
                type: "is-danger",
                hasIcon: true,
                message: "Are you sure you want to delete all the todos on your list? This cannot be undone.",
                onConfirm: () => {
                    this.todos = [];
                    // save the updated array in localstorage
                    this.saveLocalStorageTodos();
                    this.updateTodos();
                }
            });
        },
        completeTodo(item) {
            const todo = this.findTodo(item);
            // save the updated array in localstorage
            this.saveLocalStorageTodos();
            this.updateTodos();
        },
        findTodo(item) {
            return this.todos.find(todo => todo.id === item.id);
        },
        saveLocalStorageTodos() {
            localStorage.setItem("todos", JSON.stringify(this.todos));
            this.todos = JSON.parse(localStorage.getItem("todos"));
        },
        updateTodos() {
            this.completedTodos = this.todos.filter(item => item.completed);
            this.pendingTodos = this.todos.filter(item => !item.completed);
        },
        downloadCSV() {
            this.$emit('export-started')
            const dataExport = this.todos
            if (!dataExport) {
                alert("No data to export")
                return
            }

            let csv = PapaParse.unparse(dataExport, {
                delimiter: ",",
                encoding: "utf-8"
            })

            this.$emit('export-finished')
            let blob = new Blob([csv], {type: "application/csv;charset=" + this.encoding})
            saveAs(blob, "data.csv")
        }
    }
};
</script>

<style scoped>
.priority-dot {
    height: 10px;
    width: 10px;
    background: #333;
    border-radius: 50%;
    margin-right: 5%;
    margin-top: 3%;
    float: left;
}
</style>