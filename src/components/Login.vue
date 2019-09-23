<template>
    <div class="container">
        <div class="row justify-content-center" v-if="showLogin">
            <div class="col-lg-6">
                <b-form class="bg-white shadow-sm p-3" @submit="onSubmit" @reset="onReset">
                    <p>Sign in to start your session</p>
                    <b-alert v-model="showLoginDangerAlert" variant="danger" dismissible>
                        {{loginDangerMessage}}
                    </b-alert>
                    <b-form-group
                        id="input-group-1"
                        label=""
                        label-for="input-1"
                        description="We'll never share your email with anyone else.">
                        <b-form-input
                            id="input-1"
                            v-model="form.username"
                            required
                            placeholder="Enter username"></b-form-input>
                    </b-form-group>
                    <b-form-group 
                        id="input-group-2"
                        label="" 
                        label-for="input-2"
                        description="">
                        <b-form-input
                            id="input-2"
                            v-model="form.password"
                            type="password"
                            required
                            placeholder="Enter password"></b-form-input>
                    </b-form-group>

                    <b-button type="submit" variant="primary">Login</b-button>&nbsp;
                    <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </div>
        </div>

        <div class="row justify-content-center mt-5" v-if="showListTasks">
            <div class="col-lg-12">
                <div>
                    <p>List Task</p>
                    <b-alert v-model="showTaskSuccessAlert" variant="success" dismissible>
                        {{taskSuccessMessage}}
                    </b-alert>
                    <b-button type="button" v-on:click="taskAdd()" variant="outline-success" class="mb-3 float-left">
                        Add Task
                    </b-button>
                    <b-table bordered hover :items="tasks" :fields="taskTableFields">
                        <template v-slot:cell(no)="data">
                            {{ data.index + 1 }}
                        </template>

                        <template v-slot:cell(ACTION)="data">
                            <b-button v-on:click="taskDetail(data.item.id)" type="button" variant="outline-info">
                                Detail
                            </b-button>
                            &nbsp;
                            <b-button v-on:click="taskEdit(data.item.id)" type="button" variant="outline-dark">
                                Edit
                            </b-button>
                            &nbsp;
                            <b-button v-on:click="taskDelete(data.item.id, data.item.title)" type="button" variant="outline-danger">
                                Delete
                            </b-button>
                        </template>
                    </b-table>
                </div>
            </div>
        </div>

        <div class="row justify-content-center mt-3" v-if="showTaskForm">
            <div class="col-lg-6">
                <b-form class="bg-white shadow-sm p-3" @submit="taskActionToAPI">
                    <p>{{taskAction}} Task</p>
                    <b-alert v-model="showTaskDangerAlert" variant="danger" dismissible>
                        {{taskDangerMessage}}
                    </b-alert>
                    <b-form-group 
                        id="form-task-group-1"
                        label=""
                        label-for="add-title">
                        <b-form-input
                            id="add-title"
                            v-model="form.title"
                            required
                            placeholder="Enter title"></b-form-input>
                    </b-form-group>
                    <b-form-group 
                        id="form-task-group-2"
                        label=""
                        label-for="add-note">
                        <b-form-input
                            id="add-note"
                            v-model="form.note"
                            required
                            placeholder="Enter note"></b-form-input>
                    </b-form-group>
                    <b-form-group 
                        id="form-task-group-3"
                        label=""
                        label-for="add-status" v-if="showInputStatus">
                        <b-form-select 
                            id="add-status"
                            v-model="form.status"
                            :options="statusOptions"
                            required></b-form-select>
                    </b-form-group>

                    <b-button type="submit" variant="primary" v-if="showBtnTask">{{taskAction}} Task</b-button>
                </b-form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            form: {
                username: '',
                password: '',
                title: '',
                note: '',
                status: null
            },
            token: '',
            showLogin: true,
            showLoginDangerAlert: false,
            loginDangerMessage: '',
            showListTasks: false,
            showTaskSuccessAlert: false,
            taskSuccessMessage: '',
            showTaskForm: false,
            showTaskDangerAlert: false,
            taskDangerMessage: '',
            showInputStatus: false,
            showBtnTask: false,
            taskAction: 'Add',
            taskId: '',
            taskTableFields: [
                { key: 'no', label: 'NO' },
                { key: 'title', label: 'TITLE' },
                { key: 'note', label: 'NOTE' },
                { key: 'is_completed', label: 'STATUS' },
                'ACTION'
            ],
            statusOptions: [
                { value: null, text: 'Select Status' },
                { value: '0', text: 'Not Completed' },
                { value: '1', text: 'Completed' }
            ],
            tasks: []
        }
    },
    methods: {
        onSubmit: function(evt) {
            evt.preventDefault()
            var self = this;
            axios({
                headers: { 
                    'Content-Type': 'text/plain'
                },
                method: 'post',
                url: 'http://localhost:1323/Login',
                data: {
                    username: this.form.username,
                    password: this.form.password
                }
            })
            .then(response => {
                self.token = response.data.data.token
                self.showLoginDangerAlert = false
                this.getTasks()
            })
            .catch(error => {
                self.showLoginDangerAlert = true
                self.loginDangerMessage = error.response.data.message
            })
        },
        onReset: function(evt) {
            evt.preventDefault()
            this.form.username = ''
            this.form.password = ''
            this.$nextTick(() => {
                this.showLogin = true
                this.showListTasks = false
                this.showTaskForm = false
            })
        },
        getTasks: function() {
            var self = this;
            axios({
                headers: { 
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${ self.token }`
                },
                method: 'get',
                url: 'http://localhost:1323/Tasks/' + this.form.username
            })
            .then(response => {
                var indexData = 0
                var isCompleted = ''
                var tasks = []
                for (var x in response.data.data) {
                    isCompleted = response.data.data[x].is_completed
                    if (isCompleted == '0') {
                        response.data.data[x].is_completed = 'Not Completed'
                    }
                    else if (isCompleted == '1')
                    {
                        response.data.data[x].is_completed = 'Completed'
                    }
                    else 
                    {
                        response.data.data[x].is_completed = ''
                    }
                    tasks[indexData] = response.data.data[x]
                    indexData++
                }
                self.tasks = tasks
                self.showLogin = false
                self.showListTasks = true
                self.showTaskForm = false
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        taskAdd: function() {
            var self = this
            self.showTaskForm = true
            self.taskAction = 'Add'
            self.showInputStatus = true
            self.form.title = ''
            self.form.note = ''
            self.showBtnTask = true
        },
        taskDetail: function(id) {
            var self = this;
            axios({
                headers: { 
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${ self.token }`
                },
                method: 'get',
                url: 'http://localhost:1323/GetTask/' + id
            })
            .then(response => {
                self.showTaskForm = true
                self.taskAction = 'Detail'
                self.showInputStatus = true
                self.form.title = response.data.data[0].title
                self.form.note = response.data.data[0].note
                self.form.status = response.data.data[0].is_completed
                self.showBtnTask = false
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        taskEdit: function(id) {
            var self = this;
            axios({
                headers: { 
                    'Content-Type': 'text/plain',
                    'Authorization': `Bearer ${ self.token }`
                },
                method: 'get',
                url: 'http://localhost:1323/GetTask/' + id
            })
            .then(response => {
                self.showTaskForm = true
                self.taskAction = 'Edit'
                self.showInputStatus = true
                self.taskId = id
                self.form.title = response.data.data[0].title
                self.form.note = response.data.data[0].note
                self.form.status = response.data.data[0].is_completed
                self.showBtnTask = true
            })
            .catch(error => {
                console.log(error.response)
            })
        },
        taskDelete: function(id, title) {
            var self = this;
            if (confirm('Are you sure to delete task ' + title + ' ?')) {
                axios({
                    headers: { 
                        'Content-Type': 'text/plain',
                        'Authorization': `Bearer ${ self.token }`
                    },
                    method: 'delete',
                    url: 'http://localhost:1323/DeleteTask/' + id
                })
                .then(self.getTasks())
                .catch(error => {
                    console.log(error.response)
                })
            }
        },
        taskActionToAPI: function(evt) {
            evt.preventDefault()
            var self = this
            if (self.taskAction == 'Add') {
                axios({
                    headers: { 
                        'Content-Type': 'text/plain',
                        'Authorization': `Bearer ${ self.token }`
                    },
                    method: 'post',
                    url: 'http://localhost:1323/AddTask',
                    data: {
                        username: self.form.username,
                        title: self.form.title,
                        note: self.form.note
                    }
                })
                .then(response => {
                    self.taskSuccessMessage = 'Task added successfully'
                    self.showTaskSuccessAlert = true
                    self.getTasks()
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
            else if (self.taskAction == 'Edit') {
                axios({
                    headers: { 
                        'Content-Type': 'text/plain',
                        'Authorization': `Bearer ${ self.token }`
                    },
                    method: 'put',
                    url: 'http://localhost:1323/UpdateTask',
                    data: {
                        id: self.taskId,
                        username: self.form.username,
                        title: self.form.title,
                        note: self.form.note,
                        is_completed: self.form.status
                    }
                })
                .then(response => {
                    self.taskSuccessMessage = 'Task updated successfully'
                    self.showTaskSuccessAlert = true
                    self.getTasks()
                })
                .catch(error => {
                    console.log(error.response)
                })
            }
        }
    }
}
</script>