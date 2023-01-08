import { CreateReaderDto } from "./../api/dto/CreateReaderDto";
import { CreateBookDto } from "./../api/dto/CreateBookDto";
import { IBook } from "./../types/IBook";
import { service } from "./../api/service";
import { PassedBooks } from "./passedBooks";
import { Reader } from "./reader";
import { jsPanel } from "jspanel4";
import { createTabs } from "./tabs";
import { Book } from "./books";
import { validation } from "./validation";

export class Library {
  public modal: any;

  public books: Book[];
  public passedBooks: PassedBooks[];
  public readers: Reader[];

  private table: HTMLTableSectionElement | null;
  private list: HTMLUListElement | null;

  constructor() {
    this.books = [];
    this.passedBooks = [];
    this.readers = [];

    this.modal = null;
    this.table =
      document.querySelector<HTMLTableSectionElement>(".table__tbody");
    this.list = document.querySelector<HTMLUListElement>(".readers");

    this.setBooks();
    this.setReaders();
    this.setEvents();
    createTabs();
  }

  private async setBooks() {
    this.books.length = 0;

    const books = await service.getAllBooks();

    books.forEach((book: IBook) => {
      const newBook = new Book(book, this);

      this.books.push(newBook);
    });

    this.appendBooksToPage();
  }

  private appendBooksToPage() {
    this.books.forEach((book: Book) => {
      this.table?.append(book.element);
    });
  }

  public async setReaders() {
    if (this.list) {
      this.list.innerHTML = "";
    }

    this.readers.length = 0;
    this.passedBooks.length = 0;

    const readers = await service.getAllReaders();
    const passedBooks = await service.getPassedBooksAll();

    passedBooks.forEach(p => {
      const book = new PassedBooks(p.bookId, p.name, p.readerId, this);

      this.passedBooks.push(book);
    });

    readers.forEach(reader => {
      const books = this.passedBooks.filter(p => p.readerId === reader.id);
      const newReader = new Reader(reader, books, this);

      this.readers.push(newReader);
    });
  }

  private setEvents() {
    document
      .querySelector<HTMLButtonElement>("#addBook")
      ?.addEventListener("click", () => {
        if (this.modal) return;

        this.modal = jsPanel.create({
          headerTitle: "",
          headerControls: {
            maximize: "remove",
            smallify: "remove",
          },
          resizeit: {
            disable: true,
          },
          animateIn: "animate__fadeInDown",
          animateOut: "animate__fadeOutDown",
          onclosed: () => {
            this.modal = null;
          },
          theme: "#FFF",
          panelSize: {
            width: 400,
            height: "auto",
          },
          callback: (panel: HTMLDivElement) => {
            panel.classList.add("animate__animated");

            panel
              .querySelector(".btn__next")
              ?.addEventListener("click", async () => {
                if (validation(panel)) {
                  const book: CreateBookDto = {
                    name: "",
                    commonCount: 0,
                    vendorCode: "",
                    publishedDate: new Date(),
                    author: "",
                  };

                  const name =
                    panel.querySelector<HTMLInputElement>("#name")?.value;

                  if (name) book.name = name;

                  const circulation = parseInt(
                    panel.querySelector<HTMLInputElement>("#circulation")
                      ?.value || "0"
                  );

                  book.commonCount = circulation;

                  const vendor =
                    panel.querySelector<HTMLInputElement>("#vendor")?.value;

                  if (vendor) book.vendorCode = vendor;

                  const author =
                    panel.querySelector<HTMLInputElement>("#author")?.value;

                  if (author) book.author = author;

                  const dateEnd =
                    panel.querySelector<HTMLInputElement>("#dateEnd")?.value;

                  if (dateEnd)
                    book.publishedDate = new Date(Date.parse(dateEnd));

                  const response = await service.createBook(book);
                  const newBook = new Book(response, this);
                  this.books.push(newBook);
                  this.table?.append(newBook.element);

                  this.modal.close();
                }
              });
          },
          content: `<div class="modal__inner">
        <div class="modal__input">
            <span class="input__title">
                Наименование
            </span>
            <input id="name" type="text" class="input__name">
        </div>
        <div class="modal__input">
            <span class="input__title">
                Дата публикации
            </span>
            <input id="dateEnd" type="date" class="input__date">
        </div>
        <div class="modal__input">
            <span class="input__title">
                Автор
            </span>
            <input id="author" type="text" class="input__name">
        </div>
        <div class="modal__input">
            <span class="input__title">
                Артикул
            </span>
            <input id="vendor" type="text" class="input__name">
        </div>
        <div class="modal__input">
          <span class="input__title">
              Тираж
          </span>
          <input id="circulation" type="number" class="input__number" min=0 value=0>
        </div>
        <button class="btn__next">Далее</button>
    </div>`,
        });
      });

    document
      .querySelector<HTMLButtonElement>("#addReader")
      ?.addEventListener("click", () => {
        if (this.modal) return;

        this.modal = jsPanel.create({
          headerTitle: "",
          headerControls: {
            maximize: "remove",
            smallify: "remove",
          },
          resizeit: {
            disable: true,
          },
          theme: "#FFF",
          onclosed: () => {
            this.modal = null;
          },
          panelSize: {
            width: 400,
            height: "auto",
          },
          animateIn: "animate__fadeInDown",
          animateOut: "animate__fadeOutDown",
          callback: (panel: HTMLDivElement) => {
            panel.classList.add("animate__animated");

            panel
              .querySelector(".btn__next")
              ?.addEventListener("click", async () => {
                if (validation(panel)) {
                  const reader: CreateReaderDto = {
                    name: "",
                    birthDate: new Date(),
                  };

                  const name =
                    panel.querySelector<HTMLInputElement>("#name")?.value;
                  if (name) reader.name = name;

                  const birthDate =
                    panel.querySelector<HTMLInputElement>("#dateBirth")?.value;
                  if (birthDate) reader.birthDate = new Date(birthDate);

                  const response = await service.createReader(reader);

                  const books = this.passedBooks.filter(
                    b => b.readerId === response.id
                  );

                  const newReader = new Reader(response, books, this);
                  this.readers.push(newReader);
                  newReader.createElementTab();

                  if (newReader.element) this.list?.append(newReader.element);

                  this.modal.close();
                }
              });
          },
          content: `<div class="modal__inner">
        <div class="modal__input">
            <span class="input__title">
                ФИО
            </span>
            <input id="name" type="text" class="input__name">
        </div>
        <div class="modal__input">
            <span class="input__title">
                Дата рождения
            </span>
            <input id="dateBirth" type="date" class="input__name">
        </div>

        <button class="btn__next">Далее</button>
    </div>`,
        });
      });

    document
      .querySelector<HTMLAnchorElement>("#tabBook")
      ?.addEventListener("click", e => {
        const element = e.target as HTMLAnchorElement;

        if (this.list) {
          this.list.innerHTML = "";
        }

        if (element.classList.contains("active")) return;

        this.setBooks();
      });

    document
      .querySelector<HTMLAnchorElement>("#tabReader")
      ?.addEventListener("click", async e => {
        const element = e.target as HTMLAnchorElement;

        if (this.books.length) {
          // this.books.forEach(b => {
          //   b.element.remove();
          // });

          if (this.table) {
            this.table.innerHTML = "";
          }

          this.books.length = 0;
        }

        if (element.classList.contains("active")) return;

        await this.setReaders();

        this.readers.forEach(r => {
          r.createElementTab();

          if (r.element) {
            this.list?.append(r.element);
          }
        });
      });
  }
}
