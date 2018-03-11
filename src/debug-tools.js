/* globals document */
const playerInfoPanel = document.getElementById('player-info');

export function renderDebugInfo(state) {
  playerInfoPanel.innerHTML = JSON.stringify(state.player, null, 2);
}
