export const createTabs = () => {
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(".nav__link");
  const tabs = document.querySelectorAll<HTMLDivElement>(".tab");

  let activeLink: HTMLAnchorElement = navLinks[0];
  let activeTab: HTMLDivElement | null = tabs[0];
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      if (!activeTab) return;

      activeTab.classList.add("hide");
      activeLink.classList.remove("active");

      activeLink = e.target as HTMLAnchorElement;
      activeTab =
        Array.from(tabs).find(t => t.id === activeLink.hash.slice(1)) || null;

      if (!activeTab) return;

      activeLink.classList.add("active");
      activeTab.classList.remove("hide");
    });
  });
};
