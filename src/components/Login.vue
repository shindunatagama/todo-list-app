<template>
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-6">
                <b-form class="bg-white shadow-sm p-3" @submit="onSubmit" @reset="onReset" v-if="showLogin">
                    <p>Sign in to start your session</p>
                    <b-alert v-model="showDangerAlert" variant="danger" dismissible>
                        {{dangerMessage}}
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

                    <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
                    <b-button type="reset" variant="danger">Reset</b-button>
                </b-form>
            </div>
        </div>

        <br />

        <div class="row justify-content-center">
            <div class="col-lg-12">
                <div>
                    <b-table bordered hover :items="tasks" :fields="taskTableFields" v-if="showTasks">
                        
                    </b-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    data: function() {
        return {
            showLogin: true,
            form: {
                username: '',
                password: ''
            },
            showDangerAlert: false,
            dangerMessage: '',
            token: '',
            showTasks: true,
            taskTableFields: [
                { key: 'no', label: 'NO' },
                { key: 'id', label: 'ID' },
                { key: 'title', label: 'TITLE' },
                { key: 'note', label: 'NOTE' },
                { key: 'is_completed', label: 'STATUS' },
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
                self.showDangerAlert = false
                this.getTasks()
            })
            .catch(error => {
                self.showDangerAlert = true
                self.dangerMessage = error.response.data.message
            })
        },
        onReset: function(evt) {
            evt.preventDefault()
            this.form.username = ''
            this.form.password = ''
            this.$nextTick(() => {
                this.show = true
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
            })
            .catch(error => {
                console.log(error.response)
            })
        }
    }
}
</script>