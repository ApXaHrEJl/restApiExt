import { CreateBookDto } from "./dto/CreateBookDto";
import { IPassedBook } from "./../types/IPassedBook";
import { IReader } from "../types/IReader";
import { IBook } from "./../types/IBook";
import axios, { Axios } from "axios";
import { CreateReaderDto } from "./dto/CreateReaderDto";

class Service {
  private BASE_URL: string;
  private _axios: Axios;

  constructor() {
    this.BASE_URL = "https://localhost:7180/api/";
    this._axios = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getAllBooks(): Promise<IBook[]> {
    return await (
      await this._axios.get(`/${Entities.Book}`)
    ).data;
  }

  async getAllReaders(): Promise<IReader[]> {
    return await (
      await this._axios.get(`/${Entities.Reader}`)
    ).data;
  }

  async getPassedBooksAll(): Promise<IPassedBook[]> {
    return await (
      await this._axios.get(`/${Entities.Book}/passedBooks`)
    ).data;
  }

  async createBook(book: CreateBookDto): Promise<IBook> {
    const newBook = await (
      await this._axios.post(`/${Entities.Book}`, book)
    ).data;

    return newBook;
  }

  async updateBook(book: CreateBookDto, id: string): Promise<IBook> {
    const updatedBook = await (
      await this._axios.put(`/${Entities.Book}/${id}`, book)
    ).data;

    return updatedBook;
  }

  async deleteBook(id: string) {
    try {
      await this._axios.delete(`/${Entities.Book}/${id}`);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async giveBook(id: string, readerId: string) {
    try {
      await this._axios.post(
        `/${Entities.Reader}/giveBook`,
        {},
        {
          params: {
            ReaderId: readerId,
            BookId: id,
          },
        }
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async passBook(id: string, bookId: string) {
    try {
      await this._axios.post(
        `/${Entities.Reader}/passBook`,
        {},
        {
          params: {
            ReaderId: id,
            BookId: bookId,
          },
        }
      );
    } catch (error: any) {
      throw new Error(error);
    }
  }

  async createReader(reader: CreateReaderDto): Promise<IReader> {
    const newReader = await (
      await this._axios.post(`/${Entities.Reader}`, reader)
    ).data;

    return newReader;
  }

  async updateReader(reader: CreateReaderDto, id: string): Promise<IReader> {
    const updatedReader = await (
      await this._axios.put(`/${Entities.Reader}/${id}`, reader)
    ).data;

    return updatedReader;
  }

  async deleteReader(id: string) {
    try {
      await this._axios.delete(`/${Entities.Reader}/${id}`);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}

enum Entities {
  "Book" = "Book",
  "Reader" = "Reader",
}

export const service = new Service();
