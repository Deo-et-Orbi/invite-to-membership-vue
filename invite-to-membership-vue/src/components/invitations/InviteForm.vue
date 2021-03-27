<template>
  <b-form @submit.prevent="onSubmit" @reset="onReset">
    <b-form-group
      id="input-group-1"
      label-for="input-1"
      description="Do wyświetlenia zaproszenia"
    >
      <b-form-input
        id="input-1"
        v-model="displayName"
        placeholder="Imię i nazwisko"
        required
      ></b-form-input>
    </b-form-group>

    <b-form-group
      id="input-group-2"
      label-for="textarea-message"
      description="Wyświetli się w formularzu zakładania konta"
    >
      <b-form-textarea
        id="textarea-message"
        v-model="message"
        placeholder="Wpisz tekst zaproszenia"
        rows="3"
        max-rows="6"
        reqired
      ></b-form-textarea>
    </b-form-group>

    <b-button type="submit" variant="primary" class="mr-2 mb-3"
      >Wygeneruj link zaproszenia</b-button
    >
    <b-button type="reset" variant="secondary" class="mb-3"
      >Resetuj formularz</b-button
    >

    <div class="mt-3">
      <StatefulResource :resource="inviteResultResource">
        <b-alert variant="success" show>
          Udało się. Wyślij tej osobie link zaproszenia: {{ invitationLink }}
        </b-alert>
      </StatefulResource>
    </div>
  </b-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Resource, StatefulResource } from "vue-stateful-resource";
import { getInvitationLink, Invitation } from "@/domain";
import { createInvitation } from "@/services";

@Component({
  components: {
    StatefulResource,
  },
})
export default class InviteForm extends Vue {
  displayName = "";
  message = "";
  inviteResultResource = Resource.empty<Invitation>();

  get invitation(): Invitation | undefined {
    return this.inviteResultResource.result
      ? this.inviteResultResource.result
      : undefined;
  }

  get invitationLink(): string {
    return this.invitation ? getInvitationLink(this.invitation) : "";
  }

  onSubmit(): void {
    this.submitInvitation();
  }

  onReset(): void {
    this.displayName = "";
    this.message = "";
    this.inviteResultResource = Resource.empty<Invitation>();
  }

  async submitInvitation(): Promise<void> {
    Resource.fetchResource<Invitation>(
      "create_invitation",
      () =>
        createInvitation({
          displayName: this.displayName,
          message: this.message,
        }).then((invitation) => this.$emit("invited") && invitation),
      (res) => (this.inviteResultResource = res)
    );
  }
}
</script>
