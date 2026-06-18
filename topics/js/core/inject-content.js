// inject-content.js
let iAllSideBarLinks = 0
import { allSideBarLinks,lastClickedSideBarLink,updateLastClicked,getHrefFromLink } from "../nav/side-bar-nav.js";
import { mainContainer } from "../ui/toggle-side-bar.js";
import { mainTargetDiv } from "../nav/main-content-nav.js";
import { initStepNavigation } from "../nav/step-nav.js";
import { removeLastStep } from "../nav/step-nav.js";
import { handleSKeySideBarNav } from "./main-script.js";

import { updateImgs } from "../ui/toggle-img-sizes.js";
import { addCopyCode } from "../ui/copy-code.js";
export const nxtBtn = document.querySelector('#endNxtBtn')
export const prevBtn = document.querySelector('#prevBtn')

// Temporary fix, i'm quering step-floats again which i shouldn't
export const lessonBtnsContainer = document.querySelector('.lesson-btns-container')
export function injectContent(href) {
    fetch(href)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(html => {

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // 🔥 CLEAN INCOMING HTML (important)
            doc.querySelectorAll("[src], [href], [action]").forEach(el => {
                ["src", "href", "action"].forEach(attr => {
                    const val = el.getAttribute(attr);
                    if (!val || val === "undefined") {
                        el.removeAttribute(attr);
                    }
                });
            });

            // 🔥 REMOVE ANY SCRIPT TAGS (prevents side effects)
            doc.querySelectorAll("script").forEach(el => el.remove());

            // 🔥 OPTIONAL: remove inline style attributes if CSP is strict
            // (this prevents the exact error you're seeing)
            doc.querySelectorAll("[style]").forEach(el => {
                el.removeAttribute("style");
            });

            const content = doc.querySelector("#targetDiv") || doc.body;

            if (!content) {
                console.error("Missing valid content in injected file");
                return;
            }

            // 🔥 INJECT CLEAN HTML ONLY
            mainTargetDiv.innerHTML = content.innerHTML;

            scrollTo(0, 0);

            // IMPORTANT: rebind everything AFTER DOM is stable
            requestAnimationFrame(() => {
                initStepNavigation({ mainTargetDiv });
                removeLastStep();
                addCopyCode();
                updateImgs();
            });

            // reset focus safely (prevents weird sidebar leaks)
            requestAnimationFrame(() => {
                const firstStep = mainTargetDiv.querySelector(".step-float");
                if (firstStep) firstStep.focus();
            });

        })
        .catch(err => {
            console.error('Failed to load content:', err);
        });
}
