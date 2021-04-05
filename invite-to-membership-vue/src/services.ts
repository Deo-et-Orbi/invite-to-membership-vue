import { Invitation } from "./domain";
import { fetchFromApi, postToApi } from "./util";

export function loadInvitations(): Promise<Invitation[]> {
  return fetchFromApi("invitation/all");
}

export function createInvitation({
  displayName,
  message,
}: {
  displayName: string;
  message: string;
}): Promise<Invitation> {
  return postToApi("invitation/invite", {
    displayName,
    message,
  });
}
