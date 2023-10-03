export default function toggleMobileNav() {
  const mobileNav = document.getElementById("mobile-nav") as HTMLElement;
  const menuIcon = document.getElementById("menu-icon") as HTMLButtonElement;
  mobileNav.classList.toggle("open");
  document.body.classList.toggle("no-scroll");
  menuIcon?.classList.toggle("open");
}
