<template>
  <StatefulResource :resource="invitationsResource">
    <b-table
      bordered
      responsive
      head-variant="dark"
      striped
      hover
      :items="items"
      :fields="fields"
    ></b-table>
  </StatefulResource>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Resource, StatefulResource } from "vue-stateful-resource";
import { getInvitationLink, Invitation } from "@/domain";
import { loadInvitations } from "@/services";

@Component({
  components: {
    StatefulResource,
  },
})
export default class InvitationsList extends Vue {
  fields = [
    {
      key: "displayName",
      label: "Imię i nazwisko",
      sortable: true,
    },
    {
      key: "message",
      label: "Wiadomość",
    },
    {
      key: "tiedEmail",
      label: "Email",
    },
    {
      key: "createdTime",
      label: "Czas utworzenia",
    },
    {
      key: "statusText",
      label: "Status",
    },
    {
      key: "linkURL",
      label: "Link",
    },
  ];

  invitationsResource = Resource.empty<Invitation[]>();

  get items(): unknown[] {
    if (!this.invitationsResource.result) return [];
    const itemsSorted = this.invitationsResource.result;
    itemsSorted.sort((a, b) => b.createdTimestampS - a.createdTimestampS);
    return itemsSorted.map((item) => ({
      ...item,
      statusText: item.acceptedTimestampS > 0 ? "Zaakceptowane" : "Oczekujące",
      createdTime: new Date(item.createdTimestampS * 1000).toDateString(),
      linkURL: getInvitationLink(item),
    }));
  }

  beforeMount(): void {
    this.reloadInvitations();
  }

  reloadInvitations(): void {
    Resource.fetchResource("invitations", loadInvitations, (res) => {
      this.invitationsResource = res;
    });
  }
}
</script>
