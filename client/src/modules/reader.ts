import { IReader } from "./../types/IReader";
import { PassedBooks } from "./passedBooks";
import { jsPanel } from "jspanel4";
import { Library } from "./library";
import { service } from "../api/service";
import { CreateReaderDto } from "../api/dto/CreateReaderDto";
import { dateToString } from "../helpers/dates";

export class Reader {
  public element: ReaderElement;
  public checked: boolean;

  public id: string;
  private name: string;
  private birthDate: Date;

  constructor(
    reader: IReader,
    public books: PassedBooks[],
    private library: Library
  ) {
    this.id = reader.id;
    this.birthDate = new Date(reader.birthDate);
    this.name = reader.name;

    this.element = null;
    this.checked = false;
  }

  createElementTab() {
    this.element = null;

    const content = this.getTabInner();
    const element: HTMLLIElement = document.createElement("li");
    element.classList.add("readers__item");
    element.innerHTML = content;

    this.element = element;
    this.setTabEvents();
  }

  createElementModal() {
    this.element = null;

    const content = this.getModalInner();

    const element: HTMLDivElement = document.createElement("div");
    element.classList.add("reader");
    element.innerHTML = content;

    this.element = element;
    this.setModalEvent();
  }

  setTabEvents() {
    this.element?.querySelector("#getBooks")?.addEventListener("click", () => {
      if (this.library.modal) return;

      this.library.modal = jsPanel.create({
        headerTitle: "Книги",
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
          width: 400,
          height: "auto",
        },
        callback: (panel: HTMLDivElement) => {
          panel.classList.add("animate__animated");

          if (!this.books.length) {
            const $book = panel.querySelector(".books");

            if ($book)
              $book.innerHTML =
                "<div class='empty'>Читатель не имеет книг</div>";
          }

          console.log(this.books);

          this.books.forEach(book => {
            panel.querySelector(".books")?.append(book.element);
          });
        },
        content: `<div class="readers__books">
                    <ol class="books"></ol>
                  </div>`,
      });
    });

    this.element
      ?.querySelector("#deleteReader")
      ?.addEventListener("click", async () => {
        await service.deleteReader(this.id);

        this.library.readers = this.library.readers.filter(
          r => r.id !== this.id
        );

        this.element?.remove();
      });

    this.element
      ?.querySelector("#changeReader")
      ?.addEventListener("click", async () => {
        if (this.library.modal) return;

        this.library.modal = jsPanel.create({
          headerTitle: "Книги",
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
            width: 400,
            height: "auto",
          },
          callback: (panel: HTMLDivElement) => {
            panel.classList.add("animate__animated");
          },
          content: `<div class="modal__inner">
        <div class="modal__input">
            <span class="input__title">
                ФИО
            </span>
            <input id="name" type="text" class="input__name" value=${this.name}>
        </div>
        <div class="modal__input">
            <span class="input__title">
                Дата рождения
            </span>
            <input id="dateBirth" type="date" class="input__name" value=${dateToString(
              this.birthDate
            )}>
        </div>

        <button class="btn__next">Далее</button>
    </div>`,
        });

        const panel = this.library.modal;

        this.library.modal
          ?.querySelector(".btn__next")
          .addEventListener("click", async () => {
            const reader: CreateReaderDto = {
              name: "",
              birthDate: new Date(),
            };

            const name = panel.querySelector("#name")?.value;
            if (name) reader.name = name;

            const birthDate = panel.querySelector("#dateEnd")?.value;
            if (birthDate) reader.birthDate = new Date(Date.parse(birthDate));

            const response = await service.updateReader(reader, this.id);

            this.name = response.name;
            this.birthDate = new Date(response.birthDate);

            if (this.element) this.element.innerHTML = this.getTabInner();
            this.setTabEvents();

            this.library.modal.close();
          });
      });
  }

  setModalEvent() {
    this.element
      ?.querySelector(".checkbox__input")
      ?.addEventListener("change", e => {
        const target = e.target as HTMLInputElement;
        this.checked = target.checked;
      });
  }

  getTabInner(): string {
    return `<div class="readers__info">
            ${this.name} • ${this.birthDate.toLocaleDateString("ru-ru")}
          </div>
          <div class="readers__btns">
            <button class="btn" id="getBooks">Получить книги</button>
            <button class="btn" id="changeReader">Изменить</button>
            <button class="btn" id="deleteReader">Удалить</button>
          </div>`;
  }

  getModalInner(): string {
    return `
        <label class='checkbox'>
          <input type=checkbox class="checkbox__input"/>
          <div class='checkbox__item'></div>
          <span class="material-icons done">
            done
          </span>
        </label>
        <span class='reader__info'>${
          this.name
        } • ${this.birthDate.toLocaleDateString("ru-ru")}</span>
      `;
  }
}

type ReaderElement = HTMLDivElement | HTMLLIElement | null;
