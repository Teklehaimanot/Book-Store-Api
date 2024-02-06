import Book from "../entity/Book";
import * as bookRepository from "../repository/bookRepository";

export async function getAllBooks(): Promise<Book[]> {
  return await bookRepository.getAllBooks();
}

export async function createBook(
  title: string,
  writer: string,
  coverImage: string,
  point: number,
  tags: string[]
): Promise<Book> {
  const newBook = new Book(title, writer, coverImage, point, tags);
  return await bookRepository.createBook(newBook);
}
