export function validation(panel: HTMLDivElement): boolean {
  let isValid = true;

  panel.querySelectorAll("input").forEach(input => {
    input.style.borderColor = "#ccc";

    const value = input.type === "number" ? +input.value : input.value;

    if (!value) {
      input.style.borderColor = "red";

      isValid = false;
    }
  });

  return isValid;
}
