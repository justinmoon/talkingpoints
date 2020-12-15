export const trackGoal = (id) => {
  if (process.env.NODE_ENV === "production") {
    window.fathom.trackGoal(id, 0)
  }
}
