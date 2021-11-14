export function toggleDarkTheme(shouldAdd: boolean): void {
  document.body.classList.toggle('dark', shouldAdd);
}

export function scrollTop(): void {
  const content: HTMLIonContentElement = document.querySelector('#root');
  content.scrollToTop();
}

export function scrollBottom() {
  const content: HTMLIonContentElement = document.querySelector('#root');
  content.scrollToBottom();
}
