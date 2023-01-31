export const getTaskTitleByExpired = (task: any) => {
  return new Date().setHours(0,0,0,0) == new Date(task.expired).setHours(0,0,0,0) ? `Твоя задача на сегодня: ${task.title}` : task.title;
}
