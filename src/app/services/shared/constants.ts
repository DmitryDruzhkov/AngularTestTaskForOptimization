export const dataSource = [
  {
    id: 0,
    title: 'Задача 1' ,
    description: 'Описание задачи',
    expired: new Date().setHours(12, 0, 0, 0)
  },
  {
    id: 1,
    title: 'Задача 2' ,
    description: 'Описание задачи',
    expired: new Date().setHours(15, 0, 0, 0)
  },
  {
    id: 2,
    title: 'Задача 3' ,
    description: 'Описание задачи',
    expired: new Date(new Date().setHours(18, 0, 0, 0)).setDate(new Date().getDate() + 1)
  },
];
