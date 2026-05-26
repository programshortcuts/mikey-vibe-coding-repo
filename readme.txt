6. Where each responsibility belongs (this is the core answer)
You asked about assigning functionality to the right scripts. Here’s the clean mental map:
    main-script.js
        Bootstrapping only
        Global listeners
        No logic

    keyboard-nav.js
        Keyboard router
        Global mode toggles
        Zone dispatching

        getfocus-zone.js
        DOM inspection only
        Returns a string
        No keyboard knowledge

    letter-nav.js
        Only handles letter-based focus movement
        Maintains its own internal state

    sidebar-nav.js
        Sidebar-specific keyboard logic
        No awareness of other zones