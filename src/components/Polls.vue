<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Polls</h1>
        <hr><br><br>
        <alert :message=message v-if="showMessage"></alert>
        <button type="button" class="btn btn-success btn-sm" v-b-modal.poll-modal>Add Poll</button>
        <br><br>
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Read?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(poll, index) in polls" :key="index">
              <td>{{ poll.title }}</td>
              <td>{{ poll.author }}</td>
              <td>
                <span v-if="poll.read">Yes</span>
                <span v-else>No</span>
              </td>
              <td>
                <div class="btn-group" role="group">
                  <button
                          type="button"
                          class="btn btn-warning btn-sm"
                          v-b-modal.poll-update-modal
                          @click="editPoll(poll)">
                      Update
                  </button>
                  <button
                          type="button"
                          class="btn btn-danger btn-sm"
                          @click="onDeletePoll(poll)">
                      Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal ref="addPollModal"
            id="poll-modal"
            title="Add a new poll"
            hide-footer>
      <b-form @submit="onSubmit" @reset="onReset" class="w-100">
      <b-form-group id="form-title-group"
                    label="Title:"
                    label-for="form-title-input">
          <b-form-input id="form-title-input"
                        type="text"
                        v-model="addPollForm.title"
                        required
                        placeholder="Enter title">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-author-group"
                      label="Author:"
                      label-for="form-author-input">
            <b-form-input id="form-author-input"
                          type="text"
                          v-model="addPollForm.author"
                          required
                          placeholder="Enter author">
            </b-form-input>
          </b-form-group>
        <b-form-group id="form-read-group">
          <b-form-checkbox-group v-model="addPollForm.read" id="form-checks">
            <b-form-checkbox value="true">Read?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-button-group>
      </b-form>
    </b-modal>
    <b-modal ref="editPollModal"
            id="poll-update-modal"
            title="Update"
            hide-footer>
      <b-form @submit="onSubmitUpdate" @reset="onResetUpdate" class="w-100">
      <b-form-group id="form-title-edit-group"
                    label="Title:"
                    label-for="form-title-edit-input">
          <b-form-input id="form-title-edit-input"
                        type="text"
                        v-model="editForm.title"
                        required
                        placeholder="Enter title">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-author-edit-group"
                      label="Author:"
                      label-for="form-author-edit-input">
            <b-form-input id="form-author-edit-input"
                          type="text"
                          v-model="editForm.author"
                          required
                          placeholder="Enter author">
            </b-form-input>
          </b-form-group>
        <b-form-group id="form-read-edit-group">
          <b-form-checkbox-group v-model="editForm.read" id="form-checks">
            <b-form-checkbox value="true">Read?</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <b-button-group>
          <b-button type="submit" variant="primary">Update</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
        </b-button-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert.vue';
export default {
  data() {
    return {
      polls: [],
      addPollForm: {
        title: '',
        author: '',
        read: [],
      },
      message: '',
      showMessage: false,
      editForm: {
        id: '',
        title: '',
        author: '',
        read: [],
      },
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    getPolls() {
      const path = 'http://localhost:5000/polls';
      axios.get(path)
        .then((res) => {
          this.polls = res.data.polls;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    addPoll(payload) {
      const path = 'http://localhost:5000/polls';
      axios.post(path, payload)
        .then(() => {
          this.getPolls();
          this.message = 'Poll added!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.log(error);
          this.getPolls();
        });
    },
    initForm() {
      this.addPollForm.title = '';
      this.addPollForm.author = '';
      this.addPollForm.read = [];
      this.editForm.id = '';
      this.editForm.title = '';
      this.editForm.author = '';
      this.editForm.read = [];
    },
    onSubmit(evt) {
      evt.preventDefault();
      this.$refs.addPollModal.hide();
      let read = false;
      if (this.addPollForm.read[0]) read = true;
      const payload = {
        title: this.addPollForm.title,
        author: this.addPollForm.author,
        read, // property shorthand
      };
      this.addPoll(payload);
      this.initForm();
    },
    onReset(evt) {
      evt.preventDefault();
      this.$refs.addPollModal.hide();
      this.initForm();
    },
    editPoll(poll) {
      this.editForm = poll;
    },
    onSubmitUpdate(evt) {
      evt.preventDefault();
      this.$refs.editPollModal.hide();
      let read = false;
      if (this.editForm.read[0]) read = true;
      const payload = {
        title: this.editForm.title,
        author: this.editForm.author,
        read,
      };
      this.updatePoll(payload, this.editForm.id);
    },
    updatePoll(payload, pollID) {
      const path = `http://localhost:5000/polls/${pollID}`;
      axios.put(path, payload)
        .then(() => {
          this.getPolls();
          this.message = 'Poll updated!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.getPolls();
        });
    },
    onResetUpdate(evt) {
      evt.preventDefault();
      this.$refs.editPollModal.hide();
      this.initForm();
      this.getPolls(); // why?
    },
    removePoll(pollID) {
      const path = `http://localhost:5000/polls/${pollID}`;
      axios.delete(path)
        .then(() => {
          this.getPolls();
          this.message = 'Poll removed!';
          this.showMessage = true;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
          this.getPolls();
        });
    },
    onDeletePoll(poll) {
      this.removePoll(poll.id);
    },
  },
  created() {
    this.getPolls();
  },
};
</script>