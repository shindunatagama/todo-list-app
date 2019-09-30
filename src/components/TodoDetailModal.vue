<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Detail {{ todo.todo }}</p>
        </header>
        <section class="modal-card-body">
            <b-field label="Title">
                <b-input type="text" v-model="title" placeholder="Your todo title" :readonly="true"></b-input>
            </b-field>

            <b-field label="Note">
                <b-input type="text" v-model="note" placeholder="Your todo note" :readonly="true"></b-input>
            </b-field>

            <b-field label="Priority">
                <b-select placeholder="Select a priority" v-model="priority" disabled>
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
        </footer>
    </div>
</template>

<script>
export default {
    name: "TodoDetailModal",
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
    }
};
</script>

<style scoped></style>