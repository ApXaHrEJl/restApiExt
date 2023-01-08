import { IBook } from "./../types/IBook";
import { IOptionsModal } from "./../types/IOtionsModal";
import { dateToString } from "../helpers/dates";
import { Library } from "./library";
import { jsPanel } from "jspanel4";
import { validation } from "./validation";
import { CreateBookDto } from "../api/dto/CreateBookDto";
import { service } from "../api/service";

export class Book {
  public element: HTMLTableRowElement;

  public id: string;
  public name: string;
  private vendor: string;
  private author: string;
  private datePublished: Date;
  private amount: number;
  private circulation: number;

  constructor(book: IBook, private library: Library) {
    this.id = book.id;
    this.name = book.name;
    this.vendor = book.vendorCode;
    this.author = book.author;
    this.datePublished = new Date(book.publishedDate);
    this.amount = book.count;
    this.circulation = book.commonCount;

    this.element = this.createElement();
    this.setEvents();
  }

  private createElement() {
    const inner = this.getInner();

    const element: HTMLTableRowElement = document.createElement("tr");
    element.classList.add("table__tr");
    element.innerHTML = inner;

    return element;
  }

  private setEvents() {
    this.element
      ?.querySelector<HTMLButtonElement>(".deleteBtn")
      ?.addEventListener("click", async () => {
        await service.deleteBook(this.id);

        this.library.books = this.library.books.filter(b => b.id !== this.id);
        this.element.remove();
      });

    this.element
      ?.querySelector<HTMLButtonElement>(".issueBtn")
      ?.addEventListener("click", () => {
        if (this.library.modal) return;

        this.library.modal = this.createModaL(this.getContentReadersModal(), {
          width: 450,
        });

        this.library.readers.forEach(reader => {
          reader.createElementModal();

          if (reader.element)
            this.library.modal
              ?.querySelector(".readersModal__content")
              ?.append(reader.element);
        });

        this.library.modal
          ?.querySelector(".btn__next")
          ?.addEventListener("click", () => {
            const ids = this.library.readers
              .filter(r => r.checked)
              .map(r => r.id);

            if (ids.length) {
              ids.forEach(async rId => {
                await service.giveBook(this.id, rId);

                if (this.amount) {
                  this.amount -= 1;
                }

                this.element.querySelectorAll("td")[4].innerHTML =
                  this.amount.toString();
              });
            }

            this.library.modal.close();
            this.library.readers.forEach(r => (r.checked = false));
          });
      });

    this.element
      ?.querySelector<HTMLButtonElement>(".changeBtn")
      ?.addEventListener("click", () => {
        if (this.library.modal) return;

        this.library.modal = this.createModaL(this.getContentChangeModal());
        const panel = this.library.modal;

        this.library.modal
          ?.querySelector(".btn__next")
          .addEventListener("click", async () => {
            if (validation(this.library.modal)) {
              const book: CreateBookDto = {
                name: "",
                commonCount: 0,
                vendorCode: "",
                publishedDate: new Date(),
                author: "",
              };

              const name = panel.querySelector("#name")?.value;
              if (name) book.name = name;

              const circulation = parseInt(
                panel.querySelector("#circulation")?.value || "0"
              );
              book.commonCount = circulation;

              const vendor = panel.querySelector("#vendor")?.value;
              if (vendor) book.vendorCode = vendor;

              const author = panel.querySelector("#author")?.value;
              if (author) book.author = author;

              const dateEnd = panel.querySelector("#dateEnd")?.value;
              if (dateEnd) book.publishedDate = new Date(Date.parse(dateEnd));

              const response = await service.updateBook(book, this.id);

              this.amount = response.count;
              this.author = response.author;
              this.circulation = response.commonCount;
              this.datePublished = new Date(response.publishedDate);
              this.vendor = response.vendorCode;
              this.name = response.name;

              this.element.innerHTML = this.getInner();
              this.setEvents();

              await this.library.setReaders();

              this.library.modal.close();
            }
          });
      });
  }

  private createModaL(content: string, options: IOptionsModal = {}) {
    return jsPanel.create({
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
        this.library.modal = null;
      },
      theme: "#FFF",
      panelSize: {
        width: options.width ? options.width : 400,
        height: "auto",
      },
      callback: (panel: HTMLDivElement) => {
        panel.classList.add("animate__animated");
      },
      content,
    });
  }

  private getInner(): string {
    return `
    <td class="table__td">${this.name}</td>
    <td class="table__td">${this.author}</td>
    <td class="table__td">${this.vendor}</td>
    <td class="table__td">${this.datePublished.toLocaleDateString("ru-ru")}</td>
    <td class="table__td">${this.amount}</td>
    <td class="table__td">${this.circulation}</td>
    <td class="table__td">
      <button class="btn issueBtn">Выдать</button>
    </td>
    <td class="table__td">
      <button class="btn changeBtn">Изменить</button>
    </td>
    <td class="table__td">
      <button class="btn deleteBtn">Удалить</button>
    </td>
  `;
  }

  private getContentChangeModal(): string {
    return `<div class="modal__inner">
        <div class="modal__input">
            <span class="input__title">
                Наименование
            </span>
            <input id="name" type="text" class="input__name" value=${this.name}>
        </div>
        <div class="modal__input">
            <span class="input__title">
                Дата публикации
            </span>
            <input id="dateEnd" type="date" class="input__date" value=${dateToString(
              this.datePublished
            )}>
        </div>
        <div class="modal__input">
            <span class="input__title">
                Автор
            </span>
            <input id="author" type="text" class="input__name" value=${
              this.author
            }>
        </div>
        <div class="modal__input">
            <span class="input__title">
                Артикул
            </span>
            <input id="vendor" type="text" class="input__name" value=${
              this.vendor
            }>
        </div>
        <div class="modal__input">
          <span class="input__title">
              Тираж
          </span>
          <input id="circulation" type="number" class="input__number" step=1 min=0 value=${
            this.circulation
          }>
        </div>
        <button class="btn__next">Далее</button>
    </div>`;
  }

  getContentReadersModal(): string {
    return `<div class='readersModal'>
      <div class="readersModal__content">
      </div>
      <button class="btn__next">Далее</button>
    </div>`;
  }
}
