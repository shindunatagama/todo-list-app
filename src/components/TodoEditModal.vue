<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Edit {{ todo.todo }}</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Title">
                <b-input type="text" v-model="title" placeholder="Your todo title"></b-input>
            </b-field>

            <b-field label="Note">
                <b-input type="text" v-model="note" placeholder="Your todo note"></b-input>
            </b-field>

            <b-field label="Priority">
                <b-select placeholder="Select a priority" v-model="priority">
                    <option
                        v-for="option in priorities"
                        :value="option.name"
                        :key="option.id">
                        {{ option.name }}
                    </option>
                </b-select>
            </b-field>
        </section>
        <footer class="modal-card-foot">
            <button class="button" type="button" @click="$parent.close()">
                Close
            </button>
            <button class="button is-primary" @click="editTodo">Save</button>
        </footer>
    </div>
</template>

<script>
export default {
    name: "TodoEditModal",
    props: {
        todo: {
            type: Object,
            required: true
        },
        priorities: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            title: "",
            note: "",
            priority: ""
        };
    },
    mounted() {
        this.title = this.todo.title;
        this.note = this.todo.note;
        this.priority = this.todo.priority;
    },
    methods: {
        editTodo() {
            const payload = {
                id: this.todo.id,
                title: this.title,
                note: this.note,
                priority: this.priority
            };
            this.$emit("edit-todo", payload);
        }
    }
};
</script>

<style scoped></style>