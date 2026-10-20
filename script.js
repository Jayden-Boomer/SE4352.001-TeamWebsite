'use strict';

// Original project data. Image paths are relative to index.html.
// Drive links live only here; index.html uses data-doc-link / data-doc-preview and script fills them in.
const NAVI_DRIVE_DOCUMENTS = {
  "plan": {
    "title": "Evolving Project Plan",
    "url": "https://drive.google.com/file/d/1hACSXPai1dtyewFtiPGW09cdF-xlPtRCoM5-7-Gh1VU",
    "preview": "https://drive.google.com/file/d/1hACSXPai1dtyewFtiPGW09cdF-xlPtRCoM5-7-Gh1VU/preview"
  },
  "slides": {
    "title": "Navi-Revised-Slides",
    "url": "https://drive.google.com/file/d/1jNQZcoRCkacBHKTDs9lEVU7aNvl5Re5bTEpy70zpXp0",
    "preview": "https://drive.google.com/file/d/1jNQZcoRCkacBHKTDs9lEVU7aNvl5Re5bTEpy70zpXp0/preview"
  },
  "wrs": {
    "title": "Navi-WRS",
    "url": "https://drive.google.com/file/d/1LT7y96SHiYgPcUXRNKzPEuwPfGUhCKLQ1s5u7DGJFtE",
    "preview": "https://drive.google.com/file/d/1LT7y96SHiYgPcUXRNKzPEuwPfGUhCKLQ1s5u7DGJFtE/preview"
  }
};

const NAVI_SHOWCASE_DATA = {
  "journey": [
    {
      "stage": "Entrance",
      "before": {
        "stage": "Entrance",
        "title": "Where am I starting?",
        "copy": "The user enters an unfamiliar mapped building and cannot confirm the starting point.",
        "alt": "A blind traveler with a cane stands inside an unfamiliar building entrance.",
        "image": "Images/journey-as-is-01-entrance.jpg"
      },
      "after": {
        "stage": "Confirm",
        "title": "Start with confirmation.",
        "copy": "Double press. Confirm the lobby location and “Library, floor 2.”",
        "alt": "The same traveler uses a phone to confirm their location and destination in the lobby.",
        "image": "Images/journey-to-be-01-confirm.jpg"
      }
    },
    {
      "stage": "Route choice",
      "before": {
        "stage": "Junction",
        "title": "Which corridor is right?",
        "copy": "Similar corridors make the turn toward the library uncertain.",
        "alt": "The traveler faces a junction of similar indoor corridors.",
        "image": "Images/journey-as-is-02-junction.jpg"
      },
      "after": {
        "stage": "Choose",
        "title": "Choose an eligible route.",
        "copy": "Choose avoid-stairs. Hear the next turn on the eligible elevator route.",
        "alt": "The traveler follows a corridor while receiving guidance through their phone.",
        "image": "Images/journey-to-be-02-choose.jpg"
      }
    },
    {
      "stage": "Obstruction",
      "before": {
        "stage": "Obstruction",
        "title": "A cart blocks the path.",
        "copy": "A cart blocks the corridor. The user stops and reassesses with a cane.",
        "alt": "The traveler encounters a cleaning cart blocking part of a corridor.",
        "image": "Images/journey-as-is-03-obstruction.jpg"
      },
      "after": {
        "stage": "Stop",
        "title": "Pause for the obstruction.",
        "copy": "“Stop. A cart is ahead.” Pause until the path clears or a detour is confirmed.",
        "alt": "The traveler pauses near the cleaning cart while using Navi on a phone.",
        "image": "Images/journey-to-be-03-stop.jpg"
      }
    },
    {
      "stage": "Recovery",
      "before": {
        "stage": "Assistance",
        "title": "Ask for directions.",
        "copy": "The user asks staff where to find the elevator and library floor.",
        "alt": "A staff member points out directions to the traveler beside an elevator.",
        "image": "Images/journey-as-is-04-assistance.jpg"
      },
      "after": {
        "stage": "Recover",
        "title": "Recover the camera view.",
        "copy": "If the view fails: “Pause. Clear and face the camera forward.” Say resume after checks pass.",
        "alt": "The traveler adjusts the phone camera near the elevator.",
        "image": "Images/journey-to-be-04-recover.jpg"
      }
    },
    {
      "stage": "Floor change",
      "before": {
        "stage": "Floor change",
        "title": "Get oriented again.",
        "copy": "After the elevator trip, the user must establish the new floor and heading.",
        "alt": "The traveler stands at an open elevator and must establish their new location.",
        "image": "Images/journey-as-is-05-floor-change.jpg"
      },
      "after": {
        "stage": "Re-localize",
        "title": "Confirm the new floor.",
        "copy": "At the elevator exit, confirm floor 2 and heading before another turn.",
        "alt": "The traveler uses a phone to confirm their floor and heading at the elevator exit.",
        "image": "Images/journey-to-be-05-re-localize.jpg"
      }
    },
    {
      "stage": "Arrival",
      "before": {
        "stage": "Library",
        "title": "Confirm with staff.",
        "copy": "Staff help identify the library entrance. Arrival depends on local assistance.",
        "alt": "A staff member helps the traveler identify the library entrance.",
        "image": "Images/journey-as-is-06-library.jpg"
      },
      "after": {
        "stage": "Arrive",
        "title": "Reach the right entrance.",
        "copy": "Match the mapped library entrance and announce arrival. Say stop.",
        "alt": "The traveler arrives at the mapped library entrance with Navi on a phone.",
        "image": "Images/journey-to-be-06-arrive.jpg"
      }
    }
  ],
  "commands": {
    "Repeat": "The most recent navigation instruction is repeated.",
    "Pause": "Directional guidance pauses until the user resumes or ends the trip.",
    "Resume": "Camera and location are checked before directional guidance resumes.",
    "Stop": "The navigation session ends.",
    "Help": "Navi follows the user’s saved, authorized assistance plan and announces the contact status."
  }
};

(() => {
            'use strict';
            const files = NAVI_DRIVE_DOCUMENTS;

            // Fill every Drive link from NAVI_DRIVE_DOCUMENTS so URLs are only defined once.
            document.querySelectorAll('[data-doc-link]').forEach(link => {
                const doc = files[link.dataset.docLink];
                if (doc) link.href = doc.url;
            });

            const tabs = Array.from(document.querySelectorAll('.document-tab'));
            const dialog = document.getElementById('reader');
            const expandedFrame = document.getElementById('expanded-frame');
            let previousFocus = null;

            function showDocument(key, focusTab = false) {
                if (!Object.prototype.hasOwnProperty.call(files, key)) return;
                tabs.forEach(tab => {
                    const active = tab.dataset.document === key;
                    tab.setAttribute('aria-selected', String(active));
                    tab.tabIndex = active ? 0 : -1;
                    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
                    if (active && focusTab) tab.focus();
                });
                const frame = document.querySelector('#panel-' + key + ' iframe');
                if (!frame.hasAttribute('src')) frame.src = files[key].preview;
            }

            tabs.forEach((tab, index) => {
                tab.addEventListener('click', () => showDocument(tab.dataset.document));
                tab.addEventListener('keydown', event => {
                    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
                    const backward = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
                    let next = index;
                    if (forward) next = (index + 1) % tabs.length;
                    else if (backward) next = (index - 1 + tabs.length) % tabs.length;
                    else if (event.key === 'Home') next = 0;
                    else if (event.key === 'End') next = tabs.length - 1;
                    else return;
                    event.preventDefault();
                    showDocument(tabs[next].dataset.document, true);
                });
            });

            document.querySelectorAll('[data-reload]').forEach(button => {
                button.addEventListener('click', () => {
                    const key = button.dataset.reload;
                    document.querySelector('#panel-' + key + ' iframe').src = files[key].preview;
                });
            });

            document.querySelectorAll('[data-expand]').forEach(button => {
                button.addEventListener('click', () => {
                    const key = button.dataset.expand;
                    if (typeof dialog.showModal !== 'function') {
                        const link = document.createElement('a');
                        link.href = files[key].url;
                        link.target = '_blank';
                        link.rel = 'noopener noreferrer';
                        link.click();
                        return;
                    }
                    previousFocus = button;
                    document.getElementById('reader-title').textContent = files[key].title;
                    expandedFrame.title = files[key].title + ' Google Drive preview';
                    expandedFrame.src = files[key].preview;
                    dialog.showModal();
                    document.body.classList.add('reader-open');
                });
            });

            document.getElementById('close-reader').addEventListener('click', () => dialog.close());
            dialog.addEventListener('close', () => {
                document.body.classList.remove('reader-open');
                expandedFrame.removeAttribute('src');
                if (previousFocus) previousFocus.focus();
            });

            const smallScreen = window.matchMedia('(max-width: 740px)');
            function setTabOrientation() {
                document.querySelector('.document-list').setAttribute('aria-orientation', smallScreen.matches ? 'horizontal' : 'vertical');
            }
            if (smallScreen.addEventListener) smallScreen.addEventListener('change', setTabOrientation);
            setTabOrientation();
            showDocument('plan');
        })();

(() => {
            'use strict';
            const content = NAVI_SHOWCASE_DATA;
            const screenTabs = Array.from(document.querySelectorAll('.screen-tab'));
            let selectedState = 0;
            function showState(index, focus = false) {
                selectedState = (index + screenTabs.length) % screenTabs.length;
                screenTabs.forEach((tab, i) => {
                    const active = i === selectedState;
                    tab.setAttribute('aria-selected', String(active));
                    tab.tabIndex = active ? 0 : -1;
                    document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
                    if (active && focus) tab.focus();
                });
            }
            screenTabs.forEach((tab, index) => {
                tab.addEventListener('click', () => showState(index));
                tab.addEventListener('keydown', event => {
                    let target = index;
                    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target++;
                    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target--;
                    else if (event.key === 'Home') target = 0;
                    else if (event.key === 'End') target = screenTabs.length - 1;
                    else return;
                    event.preventDefault();
                    showState(target, true);
                });
            });
            document.getElementById('next-state').addEventListener('click', () => showState(selectedState + 1));
            showState(0);

            const journeyButtons = Array.from(document.querySelectorAll('.journey-step'));
            let selectedStep = 0;
            function showStep(index) {
                if (index < 0 || index >= content.journey.length) return;
                selectedStep = index;
                const step = content.journey[index];
                journeyButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
                for (const side of ['before', 'after']) {
                    const scene = step[side];
                    const image = document.getElementById(side + '-image');
                    image.src = scene.image;
                    image.alt = scene.alt;
                    document.getElementById(side + '-step').textContent = String(index + 1).padStart(2, '0') + ' / ' + scene.stage;
                    document.getElementById(side + '-title').textContent = scene.title;
                    document.getElementById(side + '-copy').textContent = scene.copy;
                }
                document.getElementById('journey-progress').textContent = 'Step ' + (index + 1) + ' of ' + content.journey.length + ' · ' + step.stage;
                document.getElementById('previous-step').disabled = index === 0;
                document.getElementById('next-step').disabled = index === content.journey.length - 1;
            }
            journeyButtons.forEach((button, index) => button.addEventListener('click', () => showStep(index)));
            document.getElementById('previous-step').addEventListener('click', () => showStep(selectedStep - 1));
            document.getElementById('next-step').addEventListener('click', () => showStep(selectedStep + 1));
            showStep(0);

            const commandButtons = Array.from(document.querySelectorAll('.voice-command'));
            commandButtons.forEach(button => {
                button.addEventListener('click', () => {
                    commandButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
                    document.getElementById('command-response').textContent = content.commands[button.dataset.command];
                });
            });
        })();
