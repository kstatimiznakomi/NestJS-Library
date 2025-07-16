export type User = {
  id: number,
  lastname: string,
  surname: string,
  firstname: string,
  username: string,
  email?: string,
  password?: string,
  role: string,
  phone: string,
};

export type Criteries = {
  author: boolean,
  genre: boolean,
  publisher: boolean,
};

export type Book = {
  id: number,
  bookName: string,
  poster: string,
  description: string,
  count: number,
  publicDate: number,
};