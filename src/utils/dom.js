export function qs(selector, scope = document) {
  return scope.querySelector(selector);
}

export function qsa(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

export function setHTML(target, markup) {
  if (!target) return;
  target.innerHTML = markup;
}
