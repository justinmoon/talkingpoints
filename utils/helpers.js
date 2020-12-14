export function userIsMember(user) {
  console.log(users)
  return user.subscriptions.some((sub) => sub.active)
}
