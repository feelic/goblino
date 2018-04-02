/* globals document */
const keyState = {};
let listeners = {};

export function startKeyboardController(controls) {
  listeners = controls;

  document.addEventListener('keypress', evt => {
    keyState[evt.key] = true;
  });
  document.addEventListener('keyup', evt => {
    clearKey(evt.key);
  });
}

export function registerKeyboardEvents(state) {
  Object.keys(keyState).forEach(key => {
    listeners[key] && listeners[key](state);
  });
}

export function clearKey(key) {
  delete keyState[key];
}
