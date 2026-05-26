//  get-focus-zone.js
// Why is is = {} ????  - answer = it can't be passed an empty object
export function getFocusZone({ e, el } = {}) {
    const target = el || e?.target || document.activeElement;

    // 🔒 No focus yet? Default to sidebar
    if (!target || target === document.body) {
        return 'sideBar';
    }

    if (target.closest('header')) return 'header';
    if (target.closest('aside.side-bar')) return 'sideBar';
    if (target.closest('#mainTargetDiv')) return 'mainTargetDiv';

    // Safe fallback
    return 'sideBar';
}
