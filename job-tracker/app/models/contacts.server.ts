export async function getContactList(userId: string) {
  return await (
    await fetch(process.env.API_BASE_URL + "/contacts/user/" + userId)
  ).json();
}
