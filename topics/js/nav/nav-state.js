// nav-state.js
export const navState = {
    allLinks: [],
    current: null,
    lastClicked: null,
    lastFocused: null,
};

export function setLinks(links) {
    navState.allLinks = links;
}

export function setLastClicked(link) {
    navState.lastClicked = link;
    navState.current = link;
}

export function setLastFocused(link) {
    navState.lastFocused = link;
}