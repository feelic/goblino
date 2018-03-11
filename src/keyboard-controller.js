/* globals document */
const keyState = {};
let listeners = {};

export function startKeyboardController(controls) {
  listeners = controls;

  document.addEventListener('keypress', evt => {
    keyState[evt.key] = true;
  });
  document.addEventListener('keyup', evt => {
    delete keyState[evt.key];
  });
}

export function registerKeyboardEvents(state) {
  Object.keys(keyState).forEach(key => {
    listeners[key] && listeners[key](state);
  });
}
