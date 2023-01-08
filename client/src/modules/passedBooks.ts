import { Library } from "./library";
import { service } from "./../api/service";
export class PassedBooks {
  public element: HTMLLIElement;

  constructor(
    public id: string,
    public name: string,
    public readerId: string,
    private library: Library
  ) {
    this.element = this.createElement();

    this.setEvents();
  }

  createElement(): HTMLLIElement {
    const content = this.getBookInner();

    const element = document.createElement("li");
    element.classList.add("books__item");
    element.innerHTML = content;

    return element;
  }

  setEvents() {
    this.element
      ?.querySelector("#passBook")
      ?.addEventListener("click", async () => {
        await service.passBook(this.readerId, this.id);

        const reader = this.library.readers.find(r => r.id === this.readerId);

        if (reader) reader.books = reader.books.filter(b => b !== this);
        this.element.remove();
      });
  }

  getBookInner(): string {
    return `<div class="books__content">
        <span class="books__info">${this.name}</span>
        <span class="books__btn">
          <button class="btn" id="passBook">
            Сдать
          </button>
        </span>
      </div>`;
  }
}
