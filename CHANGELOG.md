# Changelog

All notable changes to Penstock are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Releases from
26.9.0 are numbered by the calendar, `YY.M.N`; earlier ones followed
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

Each release ships as three Marketplace builds from the same source: `X-242` for IDEs
2024.2–2025.1, `X-252` for 2025.2–2026.1 and `X-262` for 2026.2 and later. The CLI carries the same
number, without the suffix.

## [Unreleased]

## [26.10.1] - 2026-10-19

### Added

- Penstock Web and Desktop have one window shell: a title bar with the Penstock dot, the project switcher with the open file, search and a Settings gear; a sidebar island with the actions (Check, Scenarios, Monitor, Debug, Auto layout, with a count where something waits or failed), the Project tree - the Penstock tool window's processes, elements, decisions, forms, workers and the code behind them, with Group by files - and the Chats; and the editors as a dock of tab groups you split, join and resize with the pointer or the keyboard, never narrower than their toolbar needs, saved with the session; below 900px the sidebar opens as a drawer
- AI chat in every editor and every host (JetBrains, VS Code, Penstock Web and Desktop): an input at the foot of the BPMN, DMN and form editors talks to the AI agent of your choice over the Agent Client Protocol - Claude Code, Codex, Gemini CLI, OpenCode, any agent of the ACP Registry or your own command - running on your own account with Penstock's MCP server, so it reads diagrams, rules, scenarios and code links; the answer opens in a card over the input (or in a column at the side), with the elements, files and classes it names as chips, its work folded into one row, a proposed diagram change as a list, a small picture of the touched part and a ghost on the canvas, the file's own diff one press away, and every write asked before it happens
- The chats belong to the project and are listed in the sidebar of Penstock Web and Desktop and under the tree of the Penstock tool window in JetBrains and VS Code, each with its state (working, waiting for you, idle, failed); each editor opens on the latest chat its file took part in, messages typed while a turn runs are queued, and Stop cancels the turn
- One settings button in the input shows the agent's logo, the model and the thought level ("Opus 5.5 High") and opens a small form to change the agent, the model, the thought level and the mode, remembered per agent; the agents screen (Settings | Tools | Penstock | AI agents in JetBrains, "Penstock: AI agents" in VS Code, Settings in Penstock Web and Desktop) installs, turns on, updates and removes agents from the ACP Registry, refreshes their models, turns the AI chat off everywhere and chooses where conversations open; everything is kept in `~/.penstock/preferences.json`. Sending a message needs Pro
- `penstock agent [claude|codex|gemini|opencode|<id>]` starts an agent's own command line with the penstock MCP server set up for that run only, and `penstock agent serve` serves a project's chats to an IDE plugin on 127.0.0.1
- The AI chat is one agent session per project for every window and host: a chat running in one window shows as busy in the others and a message typed there queues behind it, a chat made or changed in one host appears in the others within a second, and a question nobody answers is cancelled after a grace period
- The script or expression of a BPMN element opens in its own script tab, with the process's variables offered and the step that writes each one shown: in the JetBrains IDE the script runs and is debugged through the IDE's own run configuration and debugger, and the tabs are listed under a Scripts branch of the Penstock tool window; the same tab is in VS Code, Penstock Web and Desktop
- FEEL expressions get a syntax check, completion, documentation and a Run that evaluates them with sample values, in the JetBrains IDE and in VS Code; an expression can be debugged step by step through its sub-expressions, with the value of each one shown beside it, in both; the FEEL fields of scenario conditions, Camunda 8 conditions and DMN output cells offer the project's variables, and every FEEL field keeps its own undo and redo
- A step's variables are typed from the code behind the diagram, for Java, Kotlin, Groovy, JavaScript and TypeScript in the IDE and for Python, Go, C# and Scala through the command line, so completion offers every variable of the whole process, with its fields, in every expression for free; the findings about them are Pro: a variable written and never read, a read before any write, a field a worker does not fetch, and the field and name checks of `penstock.yaml`
- Go to code, Runs in and the usages of a job type, a topic or an error code, at each line that raises it, work for Python, Go, C# and Scala workers through the command line, and in the IDE for Java, Kotlin, Groovy and JavaScript code, which Penstock now reads through the code's syntax tree instead of text patterns; these links need Pro, and going from a Camunda 7 delegate to its class or bean stays free
- The next element of a flow is suggested as a ghost beside a dead end when Penstock is confident of it, worked out from the diagram, its neighbours and the names in the project: Tab adds it in one undo step, Esc dismisses it, and the preference `suggestNextBlock` turns it off; it is free
- A field of the properties panel offers a name, a source or an expression as ghost text after the caret, worked out from the diagram, the project's files and the names around it, and ranked by the shipped suggestion ranker: Tab accepts it, Esc dismisses it, it speaks only when it is confident, and the preference `suggestions` turns it off; it is free
- The DMN requirements diagram takes cut, copy, paste and duplicate through the same clipboard, keys and menu entries as the BPMN editor
- Ctrl+D (⌘D on macOS) duplicates the selection in place in the BPMN editor and the requirements diagram, without touching the IDE's clipboard
- Saved scenarios can be renamed, duplicated and deleted from the Scenarios tab
- Penstock Web: service, send, receive, business rule and user tasks and call activities show a small mark that says whether the code behind them was found in the project (a worker, delegate, bean, message or called process), quiet when it is, amber when it is missing, blue with a count when several places match; hovering or focusing it shows the first lines of the code and opens the file, a Code group in the properties panel offers the same actions from the keyboard, a missing job type that an installed element template names offers its worker stub, and Show code badges in the More menu hides the marks
- Timeline under the BPMN canvas (Timeline in the command palette): a lane per element against time for the instance picked in the Monitor or a scenario run, bars coloured by status, duration or coverage, a draggable and keyboard-operable playhead that moves the tokens along the sequence flows on the canvas, long waits folded so the steps around them stay readable, and a click on a bar selects the element and shows the variables the step changed
- Proposed changes to a diagram are reviewed on the canvas: an agent proposes typed operations (the vocabulary of `penstock edit` and the MCP edit tool, now with `move` and a decision reference), they are checked first and drawn as ghost elements with the result of the check, and each change is accepted or rejected on its own, or all at once, as one undo step each
- Penstock Web: `penstock web` serves the editors in a plain browser on 127.0.0.1 behind a random token, with a project tree, open-file tabs, BPMN, DMN and form editors, and Ctrl+S saving to disk
- Penstock Web opens, switches and closes projects from the page: a welcome page with the recent projects, a folder browser, a project switcher, the tree as the project's own folders, and create, rename, duplicate, move, delete, upload and download (a file or the whole project as a zip) without leaving the browser
- Penstock Web does what the IDE did for the editors: open a class or a bean from a diagram in a read-only code tab, compare a diagram with the last commit, rename a linked name across files with a plan and a conflict check, install connector templates and import diagrams into the project, copy and paste between tabs, and manage the licence (status, trial, key, checkout) from the page
- Penstock Web and Desktop: code tabs and the text editor highlight Java, Kotlin, Groovy, TypeScript and JavaScript, JSON, YAML, XML, SQL, Markdown and properties in the editor's theme colours, and talk to a language server you install (jdtls, kotlin-language-server, typescript-language-server, yaml-language-server and others, or your own under `languageServers` in `~/.penstock/preferences.json`) for completion, hover, diagnostics and go to definition; without one the tab still highlights and says which server to install. A line of code that a diagram element names (a job type, a topic, a class, a bean, a message) gets a marker in the gutter and a hover naming the diagram and the element, and a click opens the diagram on that element; the XML text editor completes job types, topics, classes, beans and message names the project shares with its code
- Penstock Desktop: the same editor and local server as `penstock web` in an application window on Electron (macOS dmg for arm64 and x64), with one server per window, native folder dialog, menu, recent projects, window state restored, files opened from the Finder, and a restart button when the server stops; not part of the release yet, built with `./gradlew :desktop:packageApp`
- Debug process on Camunda 7 and 8: run a debug copy of the open process on a local or test engine, stop at breakpoints you set on the canvas, continue or step, and see where it stands in the new Debug tab; the copy and its instances are removed when the session ends
- A scenario that reaches a user task shows the task's live form in the sidebar: type the values, they become the step's variables, and the review lists them with the step
- Open in Tasklist from the Monitor and the command palette, for a process, an instance or a user task, on Camunda 7 and 8 (on Camunda 8 SaaS the link is the region's own Tasklist host)
- Test cases are checked against the Camunda Process Test schema (8.9 and 8.10): fifteen instructions run and are written back unchanged, and the thirteen Penstock cannot run yet are named in a message instead of being dropped
- The Monitor lists the last finished and cancelled instances of the open process, with their state and duration, and marks the path a picked instance took on the canvas, on Camunda 7 and 8
- A user task waiting on the connected engine shows its form in the Monitor: fill it in and Complete it from the editor, on Camunda 7 and 8
- Start an instance of the open process on the connected engine with variables you type as JSON, from the Monitor or the command palette, on Camunda 7 and 8
- A scenario step can answer a timer (advance time by a duration) and mock a worker (complete with variables, throw a BPMN error or fail), with the same views as a user task form; the answers are written as Camunda Process Test instructions
- The Monitor retries an incident (Camunda 8), cancels an instance after asking, sends a message and broadcasts a signal, on Camunda 7 and 8

### Changed

- The pre-commit hook `penstock init --hooks` writes runs the Penstock command line on the PATH, or the one in the project's `node_modules`, before it asks npm for anything; with none installed it prints one line on stderr saying where to install it and lets the commit through
- The MCP entry `penstock mcp --config` prints names the exact version of the command line that printed it, and runs `penstock mcp` when that version is not a published release
- Cut, copy, paste and select all in diagrams work across tabs and windows in Penstock Web and Desktop, and Desktop's Edit menu has them too
- Deploy is in the toolbar of every editor; without an engine it is disabled and says why
- A BPMN file without a layout opens laid out in memory and is written only once it is edited, so opening a file never changes it on disk
- Checkboxes take the theme's colours, and a decision table fits its content
- `penstock deploy` prints one table, `STATUS`, `ENDPOINT`, `FILES`, `TARGET` and `DETAILS`, with a row per engine and per file it skips, where it printed a sentence per deployment
- The help lists `penstock test-cases` as the command behind `scenarios run` and `scenarios generate`, with its `--generate` option
- A baseline test for the layout corpus passes when a diagram improves on its recorded numbers, and prints a note saying the baseline can be lowered; it fails only on a regression
- The editor loads about half the code on start (5.0 MB instead of 9.5 MB of JavaScript): only the active language, and the PDF export, the form viewer and the auto layout engine on first use; cold start to interactive is 30-40% faster on the measured diagrams
- The Penstock tool window icon and the VS Code Activity Bar icon are redrawn to the icon rules of each host: a rounded diamond with a plus at the stroke the New UI uses in compact and standard mode, light and dark, and a single-colour 24px icon in VS Code
- Updated bpmn-js 18.31, camunda-bpmn-js 5.36, form-js 2.1, properties-panel 3.56, dmn-js 17.12 and the token simulation 1.0, and the build tools behind them; the properties panel's two new labels and the `historyTimeToLive` property are named in all nine languages

### Fixed

- Auto layout of a gateway with about a hundred branches no longer runs for almost a minute before refusing: the routing cost estimate now counts the edges around one shape, so the layout is refused within a second and the diagram is left as it was.
- The npm package of the command line carries the third-party notices of what it ships, and the release build includes the editor page that `penstock web` serves
- Nothing the command line writes or the editors start runs an unpinned npm package any more: the `latest` fallback is gone, a development build of the CLI or an editor runs only a local command, and a published version is always the exact one
- The diagram stays readable when the editor colour scheme's brightness differs from the IDE theme's: the canvas then takes the IDE's own document colour
- The Code tab no longer says that a task has no code while its workers are still being read
- On macOS, Cmd+Z, Cmd+Shift+Z, Cmd+X, Cmd+C, Cmd+V and Cmd+A reach the diagram in the JetBrains editor
- Two editors open on the same diagram no longer overwrite each other's changes
- Save no longer overwrites a diagram or form that changed on disk while it was open, in the IDE and in Penstock Web
- An empty or broken diagram or form opens and says what is wrong, and a form the editor cannot read is listed in the tree instead of hidden
- A bad element template no longer stops a diagram from opening; it is listed in Problems with its reason
- Clearing a property field removes its attribute from the file, clearing a condition removes its expression, an invalid loop maximum is named under its field, and removing a data input removes its association
- A form saved with a byte-order mark opens, and duplicate element ids no longer lose an element on save
- A hit policy the engine rejects is reported as an error in scenario runs, and the Try tab finds the upstream decisions drawn in the requirements diagram
- A saved scenario shows at once, typing the first characters of a variable's value is no longer lost, a timer advance must be an ISO 8601 duration, and a Scenarios tab that was open at start-up waits for the canvas before it reads its scenario
- Keyboard focus shows on the BPMN canvas and the DMN name fields, popovers take the focus when they open, a tab's count is read out by screen readers, and PDF export is laid out at print size
- Paste from the toolbar reads the clipboard as it is and says when there is nothing to paste
- Hover documentation from a language server is sanitised before Penstock Web shows it
- Every message of the editor is translated in all nine languages, and a test fails when a translation is missing
- `penstock layout` lays out long chains of elements, and its preview no longer writes files beside the diagram; `penstock fmt` works on DMN and form files, and `fmt`, `layout` and `import` write their files whole, never half-written
- `penstock migrate analyze` keeps going past a diagram it cannot read
- The command line refuses to treat a filesystem root or a home folder as a project, carries on past unreadable folders, and says what is wrong with a bad timeout, a folder named like a diagram or a file given as the diff base; MCP results are bounded
- `~/.penstock/preferences.json` is readable by its owner only
- The licence, preferences, trusted projects, editor config, templates and saved files are replaced whole, never half-written; a licence file another program is writing is read again instead of being taken for a missing licence, and a damaged one is kept beside the trial
- A stuck machine-id lookup, an unreachable OAuth token endpoint, the connector catalogue and a slow engine no longer hold the editor or a deploy for minutes
- `penstock edit` refuses to overwrite a diagram that changed while it was open

## [26.10.0] - 2026-10-07

### Added
- The editor theme can be chosen again: follow the IDE, Light, Dark or Dracula, kept in ~/.penstock/preferences.json for every IDE; a theme saved in a project by an earlier release is taken over once.
- Renaming or moving a class, or renaming a package, from the project view offers to update the diagrams that name it
- VS Code: Penstock has its own Activity Bar view with what the Penstock tool window shows - the processes, workers, messages, decisions, forms and element templates of the project - and the same actions on it: check, scenarios, JUnit report, code links, documentation, format, change, export and doctor, each run by the project's `penstockw` or the CLI of the extension's own version.
- VS Code: `.bpmn`, `.bpmn.xml`, `.bpmn20.xml`, `.dmn` and `.form` files have their own file icons in the Explorer and the tabs, and the findings of the check are in VS Code's Problems panel, with a quick fix for a name a diagram uses and the code does not know.
- VS Code: Rename (F2) on a name the code shares with a diagram - a worker or delegate class, a bean, a topic - offers to change the diagrams and test cases that name it too; the debugger's position is shown on the diagram, worker variables are listed, an element template can be created from the Command Palette, tests run from the diagram, and the extension tells what is new after an update.
- VS Code: the listing on the Marketplace has its own page and icon.
- `penstock edit` applies a batch of edits through one session, so a large batch no longer re-checks the diagram after every edit.
- VS Code: the extension registers `penstock mcp` as an MCP server, so GitHub Copilot's agent mode and any other MCP-capable chat in VS Code 1.101 or later list the Penstock tools with no configuration. It runs the project's `penstockw` when there is one and the CLI of the extension's own version otherwise, and says so when Node.js is missing.
- Trace paths: select a step and the editor shows every path that runs through it - what leads
  there, what leads on from there - with the rest of the diagram dimmed, a boundary event read as
  a way out of its host and an event subprocess as one way into its parent, and a checkbox in the
  card that follows message flows across the pools. In a DMN requirements diagram the same action
  traces what a decision needs and what depends on it. A small card names what is traced and how
  many steps there are on each side; Esc, a click on the empty canvas or the action again ends it.
  It is on the canvas only: nothing enters the command stack, the file, an export or a share
- A Keyboard shortcuts sheet in the BPMN, DMN and form editors, opened with `?` or from the Find action list: every shortcut in the editor, grouped, with a search field, taken from what the editor really binds rather than from a list that can drift
- The variables the code of a step reads and writes are part of the variable analysis of that step, so the findings you already had reach across the code boundary: a name a worker reads that no step before it sets, and a typo near one that is. It reads `@JobWorker(fetchVariables)`, `@Variable`, `@VariablesAsType` DTOs with their fields and `@JsonProperty` names, `job.getVariable` and `getVariablesAsMap().get`, what a worker returns, `execution.getVariable` and `setVariable`, an external task's `getVariable` and `complete`, and the Node, Python, Go and C# clients beside them - in Java, Kotlin, Groovy, Scala, JavaScript, TypeScript, Python, Go and C#. Three findings are new: a variable the worker does not fetch and reads anyway (null at runtime), a variable the worker writes that no step after it reads, and a parallel multi-instance step that collects results with no output element, so every instance overwrites the others. The same three are marked in the code, on the line that reads or writes the variable
- Four more ways a step and the code behind it do not agree, each said on the step: a job type the worker takes from its method name, so a rename breaks the diagram silently; a job type, topic, class or bean one letter off the one in the code, or differing from it only in case; a variable the worker reads that no step before it sets; and a mapping line that reads a value an earlier line was meant to set, which the engine gives as null because it writes every target after it evaluates every source (camunda#11789)
- The lint pill on the canvas names the same number as the Problems tab and the sidebar badge, so the count of problems is one number everywhere; the check behind it runs whenever a diagram is open, since a pill that is always on screen cannot be right only while a tab is
- The properties panel of a worker step offers its example output inside the Example data group Camunda Modeler already has: the names that reach it and what its code reads, with the types its DTO gives, and a button that writes them where Camunda Modeler reads example data back from
- Code links in VS Code: the code of a workspace is indexed as it changes, a step in a diagram gets
  the worker or delegate that runs it, and a worker, a subscription, an error throw or a started
  process gets a line above it naming the diagram and element that use it, with go to definition and
  find all references between the two. A step nothing runs, a worker no diagram uses and a name a
  letter away from a real one are Problems, and the Penstock view in the Activity Bar is the IDE's
  tool window, with every node, toolbar action and menu item, and holds what the diagrams and the
  code say about each other. It is Penstock Pro, as in the IDE
- The plugin now installs on IntelliJ IDEA 2024.2 and every later IDE, from one Marketplace
  listing. Three builds ship from the same source, `X-242` for 2024.2 to 2025.1, `X-252` for 2025.2
  to 2026.1 and `X-262` for 2026.2 and later, and the Marketplace serves the right one. The same
  three things need a trusted project on every one of them - a deploy hook from `penstock.yaml`, the
  project's Penstock CLI, and the project's BPMN lint bundle. From 2025.2 on, the IDE's own
  Trust Project action decides that, and Penstock never overrides it. 2024.2 and 2025.1 have no
  public API to ask with, so Penstock asks you itself: the hook and the CLI open one dialog naming
  the exact command before it runs, with Cancel focused, and the lint rules ask from one
  notification instead and load as soon as you trust the project. The answer is kept outside the
  project, in `~/.penstock/trusted-projects.json`, and Settings > Tools > Penstock lists it with a
  Remove for each. Nothing is missing on the older IDEs; one question is asked instead.
- Rename works on the names a diagram and its code share, from either side. Shift+F6 on a job type or topic in `@JobWorker(type=...)`, `jobType("...")`, `subscribe("...")` or a plain literal, on a Camunda 7 bean or class, or on a process, decision or form id opens a preview listing every diagram, decision, form and source file that writes the name, in the project and in a linked repository, and one command writes them all; going from the other way, changing such a value in the properties panel offers to rename the places still holding the old one and never edits code on its own. A process id, a job type and a message name are what a deployed engine knows, so the preview says that instances already running keep the old name and offers to ask the engine, only when you ask, how many are active. Variables are left out: the analysis reports the uses it saw, not that it saw them all
- Try an expression on a running instance: pick an instance in the Monitor tab - or use the one an incident names - and a gateway's conditions, an element's input and output mappings and its script can be run against that instance's variables, with the result or the engine's own complaint next to the expression. The same Try on instance is on the expression field in the properties panel. Needs Camunda 8.9 or newer; on an older engine or on Camunda 7 the tab says which version it needs and shows the instance's variables instead. Nothing is written on the engine
- Compare the variables of a diagram with what the engine has seen: on Camunda 8.10 and newer the Monitor tab lists the names the engine has seen that nothing in the diagram names, and the names the diagram reads that the engine has never seen, with the elements involved. Clicking one selects its element
- A Try tab in the decision editor, after Problems: open a decision table, type the values its inputs ask for and see which rules match, why, and what the decision returns - the first matching rule for First, every match in rule order for Rule order, the total for Collect with Sum, Count, Smallest, Largest, Average, Middle or Most often, and the engine's own error where Unique or Any would raise one. A decision another decision feeds is run first, in order, and its result is the input of the one that uses it. The last values of a decision are kept while the file stays open, and a cell Penstock cannot read is named instead of guessed at
- A decision table goes to a spreadsheet and back: Export decision table as a workbook and as CSV write the inputs, the outputs and every rule, and Import decision table reads a workbook or a CSV whose first row names the columns, replacing the rules of the selected table, or adds a new one. A preview says what would change, rule by rule and cell by cell, and the whole import is one change, so one Undo takes it back
- A .bpmn, .dmn or .form file with findings from the check now looks wrong in the IDE: the file and its folder are marked in the project view, every finding is in the IDE's own Problems window, and the check runs in the background on the file as it is on disk, so nothing has to be open for the findings to be there or to change when you save. Code > Inspect Code runs it too, and it can be turned off in Settings > Editor > Inspections under Penstock; the findings stay in the editor either way. The findings are the ones the check card and the Problems tab of the editor show: shapes on top of each other, a connection through a shape, the bpmnlint rules, a decision table with no rule for some input, two fields of a form writing the same variable
- An element of a diagram named in a comment or a string is a link: `order.bpmn#ServiceTask_charge`, a path to the file, or a process id and the element's id after `#`. Ctrl/Cmd+click opens the diagram with that element selected, completion after `#` offers the ids of the diagram that is named, and an id no diagram in the project has is marked with a quick fix offering the near ones. It works in every language, and it is part of the code links, so it needs the licence that covers them
- Element templates from the worker code, and job workers from element templates (Pro, Team in a pipeline). Create Element Template in the editor's menu, on a `@JobWorker` method, a `newWorker().jobType(...)` registration or a Camunda 7 external task subscription, writes the template of the job type or topic into `.camunda/element-templates` with one field per variable the worker reads, typed by the Java type, an enum as a dropdown, and the variables it sets as output mappings. An existing template for the same job type is brought up to date with its version bumped and the labels and descriptions you wrote kept. A template in the tool window's new Element Templates section says which worker it came from, marks one whose variables no longer match that worker - with the gap named on the step in the Code check - and offers to write a job worker from it in Java Spring, Node or Python, through the same generator the Camunda 7 to Camunda 8 conversion uses. `penstock templates generate` writes one per worker in the project, and `--check` writes nothing and fails the build when a template has drifted
- VS Code: test cases are listed in the Test Explorer, one node per diagram and one per test case,
  and running them runs the process step by step against the engine with mocks, the way
  `penstock test-cases` does, with a result per case, a line per step and the trace of a run in the
  output. A run can be opened on the diagram again
- VS Code: coverage on the diagram, read from the process test coverage reports under `target` and
  `build`, and refreshed when one of them changes
- VS Code: the visual diagram diff. "Compare With" asks for the older version (HEAD, a branch or
  another file) and opens both drawings side by side, with what was added, removed, changed and
  moved picked out. It is in the explorer and the source control view's menu for a BPMN file
- VS Code: every action of the editor is a command in VS Code's Command Palette under Penstock, with
  the name it has in the editor, and the sidebar, the palette, the dialogs, the Deploy popover, the
  check card and the properties panel follow the VS Code colour theme. The editor itself is the one
  from the IDE, with JetBrains Mono and the same layout, spacing and radii
- VS Code: a diagram named on the command line, or a tab VS Code restored, opens in the Penstock
  editor instead of as XML text
- VS Code: the extension runs on VS Code 1.88 and later, and in the editors built on it - Cursor,
  Windsurf and VSCodium
- Generate and Add scenario plan a process that starts on a message, timer or signal start event, not only a plain one: the scenario starts the engine's process instance directly at that start event, and Add scenario lets you choose which start to begin from. A start kind Penstock cannot yet express as a scenario is said in the review, not silently left out - `penstock scenarios generate` behaves the same
- The Problems tab of the sidebar lists every finding of Check, each with its error or warning icon and counted in the words of the pill on the canvas - drawing, how the process runs, rules, code, engine and, for a Camunda 7 diagram, the migration result as a group of its own - keeps its place while another tab is shown, and clicking a finding selects its element and opens the property that fixes it. The check card over the diagram is now a short summary with Show all, which opens the tab
- The Monitor tab of the sidebar shows what the engine is doing with the diagram - incidents, and the instances waiting at each step - with the badges still on the canvas; without an engine it says how to connect one
- The Code tab of the sidebar shows the workers, classes, beans, tests and usages behind the selected step, with Go to code, Find usages, Run tests and Debug tests, and a view for the full list of a long one
- Deploy opens a popover under its button - profile, engine address, the files that will be sent, Deploy - instead of deploying at once or asking in a dialog; Edit connection is in the popover, and the result is still a notification
- Command palette: the … button and Ctrl+Alt+, (⌥⌘, on a Mac) open a searchable list of every action, in sections, with recent ones first, matched letters marked, keywords such as png, c8 or bpmnlint, and a pin on each row; the same actions are in the IDE's Find Action and Keymap under Tools | Penstock, the shortcut is Find Action in Diagram in the keymap, and Export keeps Cmd/Ctrl+Shift+C
- Generate in the Scenarios panel opens a review over the diagram instead of writing files: each scenario's path is drawn with step numbers and the flows between them, its steps are listed in plain words with values you can edit, a wrong gateway condition can be fixed from the step and every scenario is planned again, and nothing is written until you press Create scenarios. Opening a saved scenario shows the same view, and after a run it shows plan against actual.
- Operaton and CIB seven as engines, next to Camunda 7 and Camunda 8: `engine: operaton` or `engine: cib-seven` in penstock.yaml or the engine setup, which `penstock init` also recognises in existing diagrams. Deploy, Monitor, Check Workers and test-case runs use the same `engine-rest` address as Camunda 7, the generated JUnit tests use each engine's own Java packages and test configuration, and an Operaton project offers to convert the `camunda:` namespace of a Camunda 7 diagram.
- `penstock init --example camunda-8` and `--example camunda-7` write a small project that runs into an
  empty folder: an order process with a service task, a user task with a Camunda Form, a decision, a
  message and an error boundary, workers (Spring Boot and Node on Camunda 8, a Java delegate and an
  external task worker on Camunda 7), test cases in the Camunda format, `penstock.yaml` and a README
  with the commands to run it against a local engine
- The tool window offers the same two examples when the project has no diagrams yet
- A first-run tour of the editor: six short steps on the palette, the properties panel, the check card, the tool
  window (it says the tool window is on the stripe at the side of the IDE), Deploy and the More menu, shown once and kept in `~/.penstock/preferences.json` with the toolbar choices.
  "Show the tour again" is in the More menu
- Every check has a stable id (`drawing/overlap`, `bpmnlint/label-required`, `form/key-clash`), a line on why it
  matters and a line on how to fix it, and a page for it under `docs/rules`, generated from the rule definitions
  with `npm run docs:rules`. The check card shows the two lines and the link under the finding you select, and
  `penstock check --format json`, SARIF and GitHub annotations carry the rule id and its link
- A Camunda 7 to Camunda 8 migration assistant, for Camunda 7, Operaton and CIB seven projects. Analysis is free:
  Migrate to Camunda 8 on the toolbar of a Camunda 7 diagram (it can be unpinned into the More menu), the section of
  the same name in the check card, the Migrate to Camunda 8 root of the tool window and `penstock migrate` list, per diagram, decision and form, what does not carry over, why, what to do and
  who does it - Penstock converts it, converts it and asks you to review it, or leaves it marked on its element for
  you. The migration report, Markdown and one self-contained HTML page, is free too. Converting is Pro, and Team in
  a pipeline: Convert shows the diagram before and after in the visual diagram diff and the folder the Camunda 8
  files will go into (`camunda-8` next to the converted folder, changeable in the preview and with `--out`),
  writes nothing until you choose Convert, and writes them there with a `penstock.yaml` of their own that says
  `engine: camunda-8`, so the Camunda 7 files stay as they are; what cannot be converted exactly stays in the file, marked with a
  `conversion:message` that Camunda Modeler reads too, and stays a finding. JUEL expressions become FEEL only
  where the result is exact, and a refusal quotes its reason. Generated forms are written beside the diagram and
  never over a form that is there. Each Java delegate, external task handler and listener is followed to its source
  and to what it becomes, with a Spring, Node or Python job worker skeleton written beside it from the variables it
  reads and writes and the BPMN errors it throws, never over a file (Pro)
- `penstock migrate [analyze|convert|report]`: `--format text|json|sarif|github`, `--fail-on warning`, `--baseline`,
  `--target 8.5` to `8.9`, `--dry-run` and `--out <dir>` for convert; the exit code follows `check`. SARIF and
  GitHub annotations need what they need for `check`
- The licence dialog, the message that explains a feature that needs Pro and `penstock license` mention Free Pro
  for students, teachers and open-source maintainers, with a link to apply. The address is the `educationUrl` in
  the licensing settings; while it is empty, nothing about it is shown
- Share as HTML, in the More menu of the BPMN, DMN and form editors and as `penstock share <file> [-o out.html]`:
  one HTML file that opens offline in any browser. A diagram is a read-only viewer with zoom and pan, the
  documentation of an element on click, the diagram's name, light and dark by the reader's own setting and a
  small "Made with Penstock" footer; the bpmn.io watermark stays visible in the corner. A decision file or a
  form is shared as its tables and fields. The file loads nothing and sends nothing: no network request,
  no CDN, no telemetry, and a content security policy that forbids them
- Import diagram, in the More menu and as `penstock import <file> [-o out.bpmn] [--force]`: turns a draw.io
  (`.drawio`, `.xml`, compressed or not), Visio (`.vsdx`), Signavio or Bizagi (`.bpmn`) diagram into BPMN 2.0.
  Tasks and their kinds, events and their triggers, boundary events, gateways, sub-processes, pools, lanes,
  sequence, message and default flows, text annotations and data objects are mapped; the positions and the
  bends of connectors are kept. What has no BPMN meaning, what was read by how it looks and what BPMN has no
  place for are listed in a dialog and in the terminal, never dropped silently. A Bizagi `.bpm` package and
  the old binary Visio `.vsd` cannot be read, and the message says what to export instead
- Engine compatibility checks for Camunda 7 and Camunda 8 diagrams, free, from `bpmnlint-plugin-camunda-compat`
  (MIT): a service task with no job type, an element or an expression the chosen version cannot run, a process with no
  history time to live. They run in the check card, on the canvas and in `penstock check`, against the version in the
  file's `modeler:executionPlatformVersion` (the newest without one) and the engine of `penstock.yaml`; Operaton and CIB
  seven are checked as Camunda 7. Each of the 60 rules has an id (`compat/implementation`), a line on why and a line on
  how to fix it in the rules catalogue and a page under `docs/rules`. Each finding is a plain sentence naming the
  element ("Charge card has no job type", "Ad-hoc sub-processes need Camunda 8.7 or newer - this diagram targets 8.6",
  "History time to live is missing"), the same in the check card, on the canvas, in `penstock check`, SARIF and GitHub
  annotations, and carries the one id of the catalogue, `compat/<rule>`. In `.bpmnlintrc` a rule is turned off as
  `camunda-compat/<rule>` (the plugin's own name) or as `compat/<rule>`. A problem another check already reports on the
  same element - two blank start events, a link event name used twice - is shown once, by bpmnlint
- DMN 1.1 and 1.2 files open in the decision editor: they are converted to DMN 1.3 on open with
  `@bpmn-io/dmn-migrate` (MIT), what the engine added to a decision is kept, and a notice above the editor says the
  file will be saved as DMN 1.3 when you change it. The file on disk is not touched until then
- A properties panel in the decision editor, from `dmn-js-properties-panel` (MIT), in the requirements diagram: id, name
  and documentation of a decision, and its version tag and history time to live on Camunda 7 and CIB seven, or its
  version tag on Camunda 8, so the id a business rule task calls is edited without opening the XML. It uses the same
  dense layout and theme tokens as the BPMN panel, opens and closes with the same toggle, and on Operaton shows id and
  name only
- A live preview in the form editor: Preview on the toolbar opens the form as a user sees it, built on the
  `@bpmn-io/form-js-viewer` the editor already ships, beside the JSON it is given and the JSON it would submit. The
  input starts as sample data made from the fields (a text, a number, the first option of a choice, one row of a
  dynamic list, a group under its path), follows the form as it is edited until you write your own, and says what is
  wrong with it when it is not valid JSON. The form-js watermark stays visible
- Transaction boundaries for Camunda 7, Operaton and CIB seven diagrams, free: Transaction boundaries in the More menu draws
  a bar where the engine commits a transaction - before a user task, a receive task, an event-based gateway, an
  external task and a message, timer, signal or conditional catch event, and before or after any activity with an
  asynchronous continuation, multi-instance ones included. The bars follow the diagram as it is edited and take the
  accent colour of the theme, and each says where the engine commits. Ported from camunda-transaction-boundaries (MIT), whose licence is in the third-party notices
- Copy as image, free, in the Export dialog: Copy beside Save puts the diagram on the IDE clipboard as a PNG drawn with the
  theme and background chosen there, light on white by default, ready to paste into Confluence, Slack or an e-mail.
  The dialog opens from Export in the More menu, from the context menu of the canvas and on Cmd/Ctrl+Shift+C. The picture
  is written by the IDE, since the browser clipboard is not available in the editor; the host takes it as
  `POST /api/clipboard/image`
- Classic BPMN diagrams get what Camunda 7 and Camunda 8 diagrams already had: the colour picker in the context pad
  (`bpmn-js-color-picker`) and the grid with snapping (`diagram-js-grid`). Both packages are now direct
  dependencies instead of arriving through `camunda-bpmn-js`
- Collapse and expand an event sub-process, free, from the change-element menu of every diagram type
  (`bpmn-js-collapse-event-subprocess`, MIT): bpmn-js only offers it for ordinary sub-processes. Checked on bpmn-js
  18.29 in the classic, Camunda 7 and Camunda 8 editors, collapsing and expanding again
- `penstock init --engine camunda-8|camunda-7|operaton|cib-seven|classic` says what the project runs on; without it, in a terminal on an empty project, init asks with a numbered choice, and anywhere else it guesses from the diagrams as before
- Comments on any element of a diagram, free, kept in the file so they travel with it through git: a comment is added on the element from the Comments tab - the author starts from the name git has for the project, and may be left empty - edited while it is yours, resolved, reopened and deleted, every one of them a single step of Undo. The comments sit in a `penstock` extension element inside the element, which Camunda Modeler and both engines ignore, so nothing a comment says changes what the process does, and they are not drawn on an exported picture. A small count of what is still open sits on the element's corner, and Show comment badges in the More menu turns it off
- Comments have a tab of their own, after Problems: with nothing selected the tab lists every element of the diagram that has a comment, the open ones first, each with its thread and the resolved ones behind a Show resolved toggle, and clicking an element brings it into view on the diagram; with an element selected it shows that element's thread under its own name, with a back arrow to the list. The tab counts what is still open in the whole diagram, and the count on a shape on the canvas opens the tab on that element. The Properties panel has no Comments group any more
- A saved BPMN or DMN file says `exporter="Penstock"` and the plugin's own version, the way Camunda Modeler's files do, so a file carries which tool and which version last wrote it. Opening a file changes nothing on it
- The classic editor gets what the Camunda 7 and Camunda 8 editors already had: Ctrl/Cmd+Shift+C over the canvas copies the selected shape as an image, the same way those two modes do, beside the colour picker and the grid all three had
- Documentation from the editor: a Documentation entry in the Help section of the BPMN, DMN and form editors, a Learn more link in the empty states of the sidebar tabs that have a guide page, Penstock Documentation in the IDE's Help menu and in Settings > Tools > Penstock, Penstock: Open documentation in VS Code, and the guide address at the end of `penstock --help`
- `penstock doctor` reports a `penstock.yaml` value outside the allowed list - `engine`, `scriptType`, `tests.language`, `deployment.auth.type` - naming the key and the values it takes

### Changed
- The VS Code extension holds project hooks to the same rule as the IDE: they run only in a project listed in `~/.penstock/trusted-projects.json`, with the environment cleaned of tokens and secrets, and the engine guard refuses a deploy when it cannot read the project's engine settings. The project files action refuses a path that a symlink leads outside the project.
- `penstock mcp --config` also prints the one line Claude Code takes, and says VS Code needs no entry.
- The editor takes the colours of the look and feel you are running instead of a set of its own, so Islands, the classic themes, Darcula, High Contrast and any third-party theme look exactly as they do and the editor follows a theme change while it is open, including an accent colour you have changed. The colours each piece of the editor uses, and the IDE key behind each one, are written down in docs/design/theme-mapping.md
- The three editors now read the same: one set of colours, one set of text roles, and one grid on both diagram canvases, so the DMN requirements diagram no longer looks different from a BPMN diagram in the dark theme. Text is 13px, 12px and 11px as the IDE itself sets them, and a user who has changed the IDE's font size gets their size
- Every control now has the states the IDE has - hover, pressed, selected, selected when the editor has lost focus, focus and disabled - each in the running theme's own shade, and a disabled label stays readable. Labels, help and hints are at the contrast WCAG asks for, and a test fails the build if one of them is not
- The licence is now a signed token. A small Cloudflare Worker (`licence-worker/`) turns Polar's answers into a token signed with a key only it holds, and the plugin, the CLI and the editor verify the signature themselves, offline, against public keys built into them, so a hand-edited file, a redirected address or a fake server can no longer make a machine Pro. The token is bound to the machine, lasts 30 days and is renewed once a day when online; offline it works until it runs out. `~/.penstock/license.json` now holds only the token, `PENSTOCK_LICENSE` is exchanged for a six-hour pipeline token, and `penstock license key` and Copy Key for CI find the key again through the e-mail sign-in because the machine no longer keeps it. A licence file from an earlier version is exchanged for a token once, when the machine is online. A pipeline key now needs a Team key and the `CI` variable, a freed seat keeps counting against the limit for 30 days (one free move per seat per 30 days), and a machine clock set back below a time the machine already saw is refused.
- The 30-day Pro trial is now kept by the licence service, so deleting files no longer starts a new one. We are moving from JetBrains Marketplace licensing to Polar, so every machine starts a fresh 30-day Pro trial from the new service: an old `trial.json` is ignored and deleted, and no trial date carries over.
- The command line is published as a minified bundle, and the plugin's licence package is obfuscated in the release build.
- The editor no longer takes the tier from a flag: it verifies the token the host gives it, and a host that cannot show one leaves the paid features locked. Asking for a feature fails closed instead of open.
- One standard for every dialog, popover and form: the same sizes, footer, focus and Esc behaviour, labels without colons, help as permanent text, and errors as text under the field with a red outline once a field has been left. Export, Import report, the connection settings, Run with input, Save as scenario, Open run and the connector templates use it; the templates browser shows a template's details inside itself instead of in a second window
- The buttons of a dialog follow the IDE: primary on the right on macOS, primary first on Windows and Linux
- The MCP server no longer gates itself as a whole: `list_diagrams`, `show_diagram` and
  `check_diagram` are free, since they only read and explain a diagram. `analyze_flow`,
  `list_scenarios`, `check_code_links` and `edit_diagram` still need the same licence their CLI
  equivalent does, and say so, with how to buy or sign in, when called without one; `tools/list`
  notes it on each of them too
- Camunda connector element templates are no longer vendored in the repository. They are downloaded
  on-demand from GitHub (`api.github.com` and `codeload.github.com`) when the user opens the connector
  marketplace or clicks Download on a missing template (never at IDE startup or on diagram open without
  user action), and cached in `~/.penstock/connectors/<ref>/` shared between the IDE and the CLI.
  Opening an existing diagram resolves templates from the local cache without network requests.
  Downloads are refreshed at most once a day, send no credentials, cookies, or project data, respect
  IDE proxy settings, and fall back to the existing cache when offline.
- The line that says a feature is paid no longer makes a verb agree with the feature's name: "Process scenarios: part of Penstock Pro. Lists every distinct way through a process...", in the command line and in the IDE
- The command line names its scenario commands after what they do: `penstock scenarios list` (was `paths`), `scenarios run` (was `test-cases`), `scenarios generate` (was `test-cases --generate`) and `penstock junit` (was `tests`). The old names still work and are left out of the help
- Converting into a folder that already holds the converted files is not a dead end: the preview offers "Replace the files in <folder>", with a warning when the folder is not under version control, and writes over them only when it is ticked
- The form editor's Check is free: it is lint, and no longer asks for a Pro licence. The decision editor's overlap and gap analysis stays Pro
- Auto Layout leaves a small bar at the bottom centre of the canvas - "Laid out 24 elements", Undo and a close button - instead of a toast that disappears. It goes away when you close it, edit the diagram or undo
- A diagram that cannot be read shows a message instead of an empty canvas with a palette and a toast: what is wrong with the parser's line, that the file was not changed, and a button that opens the XML in the Text tab at that line
- Camunda 7 transaction boundaries are drawn in the accent colour instead of the error red, and each bar says "Transaction boundary: the engine commits here" when you rest the pointer on it
- The import report no longer paints what could not be mapped in error red: it uses the warning colour, red is kept for a file that could not be read, and the heading leads with the count ("3 not imported")
- The tool window's Migrate to Camunda 8 root shows the folder beside a file name when two files share it, and sits after Deployment and Files unless every diagram in the project is Camunda 7, Operaton or CIB seven
- The More menu is grouped under View, Edit, File and Help headings (11px uppercase), and the pin is a quiet grey on pinned rows and appears on the other rows only when the pointer or the keyboard is on them
- The Connection dialog opened from the deploy menu's Connection... offers Save, which only saves, and Save and Deploy; the dialog a deploy opens because nothing is set up yet still offers Save and Deploy
- The form editor's Preview tooltip says that the palette is hidden while the preview is open
- The engine-neutral mode is called Classic BPMN everywhere in the interface: the engine question above an empty diagram said Plain BPMN. The penstock.yaml value stays `engine: classic`
- Copy as image is part of the Export dialog: Copy beside Save copies the picture with the chosen settings, and the dialog now opens light on white. The separate Copy as image entries in the More menu and the context menu are gone, and Cmd/Ctrl+Shift+C opens the dialog
- The editor's stylesheets take every colour from the theme: the check flags, tooltips, context menu, dialogs, marketplace, simulation frame and error page no longer carry hardcoded colours, shadows and scrims come from theme tokens, and radii are on the design table (2px, 5px and 16px are gone)
- The form checks are free on the command line too: `penstock check` (and `--only flow`) checks .form files without a licence, matching the form editor. Flow analysis of processes and decision analysis stay Pro
- The More menu has Fit diagram (with its Ctrl/Cmd+0 shortcut), Zoom in and Zoom out under View
- The Export dialog follows the design rules: 28px controls, 12px labels without colons, the actions Cancel, Copy and Save in one row at the bottom right, and the preview shows the whole diagram centred in its pane
- The screen for a diagram that cannot be read has a Reload button beside Open the XML, and says "This diagram cannot be opened" since the cause is not always broken XML
- The command line is published to npm as `@kern0x1b/penstock-cli`: the scope `@penstock` belongs
  to somebody else, and the free `kern0x1b` organisation is ours. The package was never published,
  so there is nothing to migrate and no old name left behind. The command is still `penstock`, and
  what runs it - the `npx` lines in the README, the entry `penstock mcp --config` prints, the
  pre-commit hook `penstock init --hooks` writes, the `penstockw` wrapper and the Homebrew formula -
  names the package `@kern0x1b/penstock-cli`
- The sidebar toggle in the BPMN, DMN and form editors is a plain button in both states; the sidebar itself shows whether it is open
- A `--format` value a command does not take is refused with exit code 2 and a message that lists the accepted values; before, `check`, `show`, `scenarios list` and others read it as text

### Fixed
- In the IDE, a diagram, a decision or a form opened while the IDE was still indexing showed "This view is not available until indexes are built" instead of the editor: the editor kept none of the data the platform puts on it, so the platform took it for one that cannot run during indexing
- Closing a project while the editor page was still asking the IDE for its files wrote an "IDE error" for each of those requests
- The editor the IDE ships could not start: the minifier renamed the parameters bpmn-js reads a module's dependencies from, so the injector could not build the modeler and no diagram opened at all. Every module in this repository that went through bpmn-js already declared its injection list for exactly this reason; three factories had been missed, and they declare theirs now
- The pieces of the interface that still came out in English are translated in the other eight languages: the state of an element template, the pass or fail of a test case, every tool description and every refusal the MCP server sends an agent, the schema `penstock edit --schema` prints, the "Why it matters" and "See" around a SARIF or GitHub annotation, the prose in the configuration files `penstock init` and the IDE write, the open source licenses tab of the settings, the four editors VS Code offers, the labels of a deployment that is not set up, and the Create label of the properties panel
- `penstock diff` with its default base always answered "Could not find the base HEAD~1": a ref written with `~` was refused as a name, so `penstock diff`, `penstock diff HEAD~1` and `penstock report` without a base could never run. `~` is read now, `^` still is not, and a base that is not a plain name no longer sends git looking for it on a remote that may not be there
- `penstock help scenarios run` and `penstock help scenarios generate` printed what Ctrl-C twice does under the exit code 1 and said nothing about a case that failed, in every language
- The licence action described itself as part of Penstock Pro, and Team in a pipeline, and Team in a pipeline, with the clause twice
- The editor asked for the embedded browser without asking whether the IDE has one, and an IDE without that module got no editor instead of a line naming what is missing
- The sidebar toggle sits next to the sidebar it opens instead of 20px away from it, and while pressed it keeps its icon readable in a light theme
- The review bot answers a `/penstock` comment only from someone who is an owner, a member or a collaborator of the repository, and never on a pull request from a fork: it says so in one line naming both repositories and does not check the fork out or run anything from it, so a fork cannot be executed with a token that writes to the repository. Both guards are in the bot as well as in the workflow `penstock init --ci` writes, so an older template is protected the same way
- A branch, commit or tag named in a `/penstock diff` comment is checked before any git command sees it, so a name that git would read as an option, a range or a path out of the repository is refused and the bot asks what to compare with
- A second run of the bot edits the answer it wrote before, on a pull request with a long comment thread, and it reads the comments page by page on GitHub and GitLab instead of only the first hundred
- A picture the platform will not host is named and pointed at the build's artifacts instead of leaving a link with no target, and a run with no artifact link at all says the pictures are in the build's artifacts
- A pipeline missing a token says which variable to set and where to set it - a Bitbucket repository access token, the Azure DevOps `$(System.AccessToken)` - instead of failing with a stack trace, and the GitLab setup says that the trigger token in the webhook URL is a secret to keep out of files, comments and logs
- Run with input sizes to its content - Small with no step to answer, Medium once there is one - instead of always opening as a 752x524 dialog with the bottom half empty
- Renaming a diagram no longer orphans its scenarios: the Scenarios tab resolves a diagram's test-case file by the process id inside it once the file name no longer matches, and renaming a diagram in the IDE offers to rename the matching test-case file alongside it
- A deprecated connector template in the marketplace is badged Deprecated with its own reason where the template gives one, and sorted after the current ones instead of interspersed alphabetically; Install's save panel now opens in the nearest `.camunda/element-templates` folder above the diagram, an existing one if the project already has one
- Clicking a finding in the check card or the Problems tab opens the properties field it names for far more rules than before - job type, form key or id, correlation key, history time to live, called element, error, escalation, message and signal references, timer definition and code findings for a missing job type, topic, class or delegate expression - and switches the sidebar to Properties even for a finding with no single field
- `penstock check`, `docs`, `share`, `migrate analyze` and the MCP tools read DMN 1.1 and 1.2 files by moving them to 1.3 first, as the decision editor does; a file that cannot be read is one finding with its file and line, and the run goes on
- Test cases are checked against the Camunda test-case schema before they run, in `penstock test-cases` and in the Scenarios panel: a case that lacks what the schema requires (an assertion without `processInstanceSelector`, an instruction with a property the schema does not allow) is not run and says what it lacks
- A test-case run no longer touches the definitions you deployed: its test build carries ids of its own (`penstock.<run>.` in front of every process, decision and form id, and of the calls between them), so what the run deploys and removes is only what it deployed itself, and the process id you start stays what you deployed
- In a project with Camunda 7 and Camunda 8 diagrams, code links keep the two apart: a Camunda 8 job type finds its job worker and never an external task subscription of the same name, a Camunda 7 topic finds the subscription and never a job worker (Go to Declaration, Find Usages, the Monitor incident's code list, Code Vision)
- A deployment the engine refuses says which files it refused and why, one line for each, in the editor and in `penstock deploy`, instead of the engine's raw list of element errors
- A deploy the engine answers with 401 or 403 offers Edit connection in the editor's message, and `penstock deploy` says what to set (`deployment.auth` in penstock.local.yaml, PENSTOCK_PASSWORD, PENSTOCK_CLIENT_SECRET or PENSTOCK_TOKEN)
- `penstock deploy` and `penstock doctor` say so when `deployment.auth.type` is basic and there is no PENSTOCK_PASSWORD, before anything is sent; a `password:` key in penstock.local.yaml is still not used, and both commands say a password comes from PENSTOCK_PASSWORD or the IDE password safe
- The publish workflow that `penstock init --ci github` writes runs when a .bpmn, .bpmn20.xml, .bpmn.xml, .dmn or .form file changes, not only a .bpmn
- The command line no longer prints "(s)": counts are followed by the word in the right number (`3 files`, `1 file`), and `penstock docs` ends with `3 pages written (1 process, 1 decision, 1 form)`
- `penstock license key` during the trial says the Pro trial is on, until when and how to enter a key, instead of "There is no licence"
- `penstock doctor` prints its settings without a PROPERTY / VALUE header
- The conversion preview centres each diagram in its pane, next to the single title and no check pill it already has
- The bot and the Azure pipeline that `penstock init --ci` writes also run when a decision, a form or a .bpmn.xml diagram changes, and `penstock license` prints its status without a PROPERTY / VALUE header
- A diagram opens fitted into the canvas instead of cut off at the edge, at 100% at most. Ctrl/Cmd+0 fits it again, and a panel that opens over a fitted diagram fits it again unless you have moved or zoomed it. Toggling the properties panel no longer rebuilds the editor and drops the undo history
- Switching the IDE theme keeps the zoom, the pan and the selection of the diagram, and of the requirements diagram in the decision editor, instead of resetting the view
- The problems pill on the canvas is hidden while the check card is open, and it counts the same findings as the card: compat findings the linter reports as info count as warnings, findings a compat rule repeats from bpmnlint count once, and the card's header shows its warnings too
- A failure after a diagram has loaded, or a reload while it loads, is no longer reported as an unreadable file
- After Auto Layout the diagram is fitted into the canvas like on open, instead of being left off the edge under the palette
- The layout bar after Auto Layout is set in JetBrains Mono at 13px, with a 28px button
- Warning strokes and markers read on white: the light theme's warning colour is a darker amber
- A row of controls in the sidebar never leaves the sidebar: the Scenarios tab's footer and its file name line wrap onto a second line at a narrow sidebar instead of wrapping their own labels and clipping the last one, the Run output panel's header keeps its title on one line and lets the path be the thing that shortens, and every one of those controls keeps its 28px target
- The palette is a two-column grid of 28px entries with a 16px icon, the shape design.md describes, and it scrolls inside its island instead of hiding the shapes that do not fit: on a tall editor all fifteen entries now fit, and on a short one - a run output panel open, say - the five that do not are still reachable rather than cut off
- The row of the toolbar and the sidebar's tab row is 36px, one 28px control with 4px above and below it, instead of 37px: the 1px line under the toolbar that no design rule asks for is gone, the row's two sides now both stand 12px from the seam between them - so the sidebar toggle no longer has an odd extra gap on its right - and that 12px no longer jumps to 8px below 768px
- The sidebar as a drawer reaches the bottom of the editor instead of stopping 44px short of it and leaving a strip of canvas and the watermark showing below
- Every target on the bar is 28px: the pin on a command palette row, the pin in the More menu and the half of a split button
- The floating surfaces use the padding design.md gives each of them: a popover and a card are 8px inside, the Deploy popover's groups are 16px apart instead of 12, the check card and the bar after Auto Layout are 8px on every side, and a dialog's header is 12px above, 16px at the sides and 8px below
- The sidebar is a drawer below 960px rather than below 840: at an 840 to 960px editor, docking a 320px sidebar left the canvas too narrow for its own toolbar, and Monitor and Scenarios fell off the bar. Every action now fits from 700px up
- The form palette's search field is the 28px it is declared to be instead of being squeezed to 19px on a short editor, and the list between the header and the search is the only part that gives way
- In VS Code a host call could be dropped on the floor with nothing said anywhere. Six schemas of
  `openapi.yaml` marked a value nullable without naming its type, which is not a schema Ajv can
  build, so every call that carried one of them - saving the preferences, which is what remembers
  the sidebar tab, the column width and the pinned actions - threw in the extension host and never
  reached its handler. The schemas name their type now, and a host call that fails for any other
  reason answers the editor with the failure instead of leaving the call hanging
- The integration suite of the VS Code extension reported success while the extension host threw
  three times per run, never finished when it did not, and left VS Code running; it now exits
  non-zero on the first failed behaviour, takes the VS Code it started down with it on a failure,
  on a timeout and on a Ctrl-C, and writes nothing outside its own temporary folder
- The integration suite opened a window on the owner's screen and then slid it off the screen with
  AppleScript, which could also move the owner's own VS Code; it now runs a copy of the app it
  downloaded, marked as an agent app, so the window stays where it opened, never comes to the front
  and has no dock icon
- A diagram with a reference to an element that is not in the file no longer crashes `penstock check` with a stack trace: the dangling reference is a finding that names the element and the missing id, the rules that cannot read such a model are skipped, and the command exits 1
- `penstock migrate --format json` writes its JSON to stdout when the migration finds errors, as every machine format does, instead of to stderr
- Paste in VS Code: copied elements are kept through the host's own clipboard operation, since the synchronous request the editor used before never reached the VS Code host
- Cancelling a deploy hook in VS Code ends its process; before, cancelling only changed a label and the hook kept running
- Closing a VS Code editor no longer leaves a pending request that answers a closed webview
- The wrapper's `penstock-wrapper.properties` version and distribution are checked before `npm install` runs, so a value like `../..` cannot leave the downloads folder or reach a shell on Windows
- The Camunda Form file type has a fixed internal name, so the IDE no longer logs an incorrect file type name at start-up in a translated IDE
- The IDE no longer runs an action it queued for a project after that project has closed, and a failed class navigation is logged instead of swallowed
- A test-case run no longer puts decisions and forms from `out` and `dist` on the test classpath; process, decision and form ids are read with an XML parser, so a commented-out `<process>` is not a declared id
- The command line called a diagram it could not read - no permission, a folder, a symlink loop - "not valid BPMN XML: EACCES ...", and called a failed write the diagram's fault; both now name the file or folder and the reason, and `export` and `share` leave nothing half written
- `diff` and `report` read a diagram over 1 MiB as new, because git's output was cut off at the default buffer
- `init --hooks` failed in a git worktree or submodule, where `.git` is a file, and ignored `core.hooksPath`; a hook that cannot be written is now a skipped line instead of a failed init
- `fmt --write` and `layout --write` stopped at the first file they could not read; they now report that file and go on with the others, and `layout` lists a failed file on stdout like `fmt` does
- `penstock constructor`, `toString` and other names every object has crashed the argument parser, and `edit` accepted them as properties, elements and events
- `doctor --format json` printed passwords and secrets written into `penstock.yaml`
- An MCP `edit_diagram` call with `dryRun` that is not a boolean wrote the file; it is refused now
- `check --only ""` passed without checking anything, `migrate` on a path that is not there said there was nothing to migrate, `import` of a folder exited 2 with a raw system error, `docs` with no page to write left an empty folder and index, and `show` and `edit` blamed the diagram for a `penstock.yaml` that could not be read
- `export --format png` called a browser failure "not valid BPMN XML"; `report` now writes its "wrote" line to stdout when it found problems, as `check` does
- Auto layout of a very dense diagram could hold the editor for minutes; it now stops after 15 seconds and says the diagram is too dense, and the diagram stays as it was
- The webview's WebAssembly module was served with a generic content type, so the browser logged a compile failure each time an editor opened; it is served as WebAssembly now
- The sidebar's tab row overflowed at its narrowest width and the selected tab squeezed its icon; the selected tab now gives way first. The form editor's palette scrolls inside its island instead of being cut off
- The running instances of a diagram: an engine answer such as 401 or 500 was reported as "nothing deployed"; it now says the engine could not be reached, with the status
- The file chooser reported a dialog that could not be shown as a cancel; it now says so
- A save that failed after announcing itself hid the next real change made to the file outside the editor
- Script tabs kept an arbitrary one open instead of the oldest once there were more than 32
- Exporting a PNG or a PDF leaked one object URL each time
- The Monitor listed every variable a step reads as never set after the engine refused the list of variable names, and the Comments tab crashed when the selection service threw

### Changed
- The sketchy drawing style uses Architects Daughter, under the SIL Open Font License, instead of
  the Virgil build it bundled before, which was licensed for personal use only. Its licence and
  JetBrains Mono's are now in the third-party notices

## [26.9.0] - 2026-09-25

### Fixed
- A diagram saved into a folder that did not exist yet failed to save; the folder is created
- The Connection dialog read the saved password or client secret back out of the IDE password safe
  into the editor's page. The IDE now only says that one is saved; leaving the field empty keeps it,
  and typing replaces it
- A deployment hook run from the IDE got its files in `PENSTOCK_FILES` separated by spaces, so a
  file name with a space in it broke the list; it gets one per line, as from the command line. A
  hook run from the command line did not get `PENSTOCK_PROFILE`, though the documentation said so
- `penstock deploy --wait` reported every Camunda 8 process as version 0: it read the version from a
  field the engine does not send
- A name in code that differs from the diagram only in case, such as a job type `charge-Card`
  against `charge-card`, was not pointed out; it is now, with a note that Camunda matches names
  exactly
- A connector's job type, such as `io.camunda:http-json:1`, was marked in the tool window as having
  no implementation
- A job type, called process or decision given as an expression (`=...`) showed up in the tool
  window as a worker or a process of that name
- `penstock code` did not read the workers in the repositories `linked` in penstock.yaml, and it and
  the MCP server read diagrams from build output such as `out` and `dist`, reporting each finding
  twice
- A diagram changed on disk, and installing a group of templates, asked in a web page dialog with
  the page's address in its title; the IDE now asks in its own dialog
- `penstock code` did not see a JavaScript external task worker that subscribes with its handler,
  `client.subscribe("topic", handler)`, and reported the topic as having no worker
- A deployment the IDE refused, for want of an address or a password, said only "The IDE answered
  400" in the editor instead of what was missing
- Exporting with Use Background no longer hides most of the diagram: the background was drawn
  over every shape that came before the arrowheads in the SVG
- `elementTemplates` in penstock.yaml worked in the IDE only with absolute file paths: a relative
  path was read from the IDE's own folder and a folder was not read at all. Both now work, relative
  to the project root
- Diagrams named `*.bpmn.xml` could be opened but not saved: the save refused any extension but `.bpmn`
- Deploying from the IDE and from `penstock deploy` meant different things by the same
  `deployment.url`: the IDE sent a Camunda 8 resource to `<url>/deployments` as `upload`, the
  command line to `<url>/v2/deployments` as `resources`. Both now use the command line's address, and
  an address that already ends in `/v2` works as well
- The IDE named every deployment after the day, so the engine's duplicate check never matched and
  every deploy was a new version. The name now defaults to "Penstock deployment" everywhere
- `preDeploy` and `postDeploy` hooks ran only from the command line; the IDE's Deploy skipped them.
  They now run for both, in a trusted project, and a failing `preDeploy` stops the deployment

### Changed
- Versions are numbered by the calendar, `YY.M.N`. This release is 26.9.0: the plugin build for
  2025.2–2026.1 is `26.9.0-252`, the one for 2026.2 and later `26.9.0-262`, and the CLI `26.9.0`
- Deploying is one implementation for the IDE and `penstock deploy`: the editor's Deploy, Deploy in
  the tool window and the command line build and read the deployment the same way. The tool window
  deploys files from folders whose penstock.yaml names another engine to that engine, and asks in
  the IDE's own dialog before deploying to a profile
- The diagram always takes the IDE's theme, and Sketchy drawing is a personal choice from the menu:
  the theme and drawing style saved in a project's IDE settings are no longer read. The tool
  window's tree or flat view and the picture format for exporting are kept in
  ~/.penstock/preferences.json with the toolbar, so they hold in every IDE
- Signing in to Penstock in the IDE is one field: an e-mail gets a code, a key is activated, and
  Buy Pro or the Team link sit beside it, instead of five buttons in a row
- Auto layout has one way in: the toolbar button lays the diagram out at once and offers Undo in
  the message that follows. The separate Auto Layout Preview tab and its XML diff are gone; to
  compare with what is saved, use the diagram diff
- `penstock check` reports everything in one run, in sections: the drawing, the bpmnlint rules and,
  on Pro, how processes, decisions and forms run. `--only drawing,rules,flow` narrows it; SARIF,
  annotations and baselines cover every section, so refresh a baseline with `--update-baseline`
  after upgrading. The CLI has fewer names: `lint` and `analyze` are parts of `check`, `against` is
  `diff <ref>`, `config` and `profiles` are in `doctor`, and buying and signing in are
  `license buy`, `license login` and `license logout`. The old names and `--json` still work for
  this release and say what replaces them. The IDE's Run Penstock menu uses the same names
- bpmnlint works without setup. The editor marks problems on the elements as you draw, using the
  project's `.bpmnlintrc` or `bpmnlint:recommended` when there is none, and lists them under Rules in
  the diagram check. The three paths the IDE used to need are gone: only rules from a bpmnlint plugin
  still need `lint.clientBundlePath`. `penstock lint` runs the same rules itself, with plugins from
  the project's node_modules, so `lint.binaryPath` and an installed bpmnlint are no longer needed
- Element templates in `.camunda/element-templates`, next to a diagram or in any folder above it,
  are used without being listed, which is where Camunda Modeler keeps them
- Auto layout spacing is no longer a setting. `layout.*` in penstock.yaml and `.bpmnlayoutrc` are
  not read: the engine is tuned to its own spacing, and a few pixels either way made its layouts
  measurably worse. The `schema` key is gone as well, since the drawing style is a view preference
- One rule decides what a paid feature needs: Pro on your machine, Team in a pipeline. SARIF and
  GitHub annotations, baselines, `report` and the bot now run locally on Pro, and every paid command
  in a pipeline needs Team. `penstock init --ci` writes a pipeline for the licence on the machine:
  without Team it runs the free check and lint, so its first run does not fail on the bot or SARIF
- Deploy is one click. It sends the diagram where penstock.yaml points - the profile in force, with
  its name, tenant and hooks - and only asks for the engine address and sign-in the first time. The
  arrow next to Deploy deploys to another profile or edits the connection. The address goes to
  penstock.local.yaml and the password or client secret to the IDE's password safe, per profile.
  Deployment name, tenant, source, activation time and the duplicate-filtering switches are no
  longer asked for: they are set in penstock.yaml, and leaving out what the engine already has is
  on unless `changedOnly: false`. `duplicateFiltering` is gone; `changedOnly` covers it
- `penstock deploy` signs in with an OAuth client as well: `auth.type: oauth` takes the client
  secret from `PENSTOCK_CLIENT_SECRET`
- A diagram opens straight away instead of behind a setup screen. The engine comes from
  penstock.yaml, then from the diagram itself - the modeler's execution platform, or its `zeebe:`
  or `camunda:` attributes - and only an empty new diagram asks, in one line above the canvas
- The editor follows the IDE's theme; the Theme and Rendering dialog is gone and the hand-drawn
  style is one switch in More. Reload from Disk left the menu, since changes on disk are picked up
- The tool window is called Penstock. A double click opens a file, Open and Copy Process ID are in
  its context menu with the command-line actions, and the reload button re-reads the disk
- Penstock draws its own icons: one outline style for BPMN, DMN and form files, `penstock.yaml`
  and `.bpmnlintrc`, with light and dark variants; a separate icon for each action in the BPMN
  Project tool window, and a redrawn tool window icon. The editor toolbar is redrawn in the same
  1px line on a 16px grid the IDE's own icons use: copy, paste and the check are no longer three
  clipboards, deploy is a cloud, the theme switch is no longer a gear, and the properties panel
  toggle shows the panel on the side it opens. A new Marketplace icon in the same shape
- The diagram editor's toolbar is yours to arrange. Every action but undo and redo is in the
  "More" menu with its name, and the pin next to it puts it on the toolbar or takes it off. Auto
  Layout, Check, Simulate, the properties panel and Deploy are pinned to start with; the minimap,
  reload, copy, paste, export, templates and the theme are not. The properties panel toggle is an
  icon at the right edge that stays pressed while the panel is open, instead of a "Hide
  Properties" button whose name changed
- The toolbar layout, the theme and the rendering are kept in `~/.penstock/preferences.json`
  (or under `PENSTOCK_HOME`) instead of each IDE's browser storage, so they are the same in every
  IDE on the machine and survive a restart. What was saved before is moved over once
- The DMN and form editors look like the diagram editor: the same toolbar of icon buttons, the
  views of a DMN file as tabs in it, and check results in the same floating card. Decision tables
  sit inset with quiet lines, no stripes and a highlight on the row under the pointer, and the
  duplicate "View DRD" button is gone
- The DMN and form editors follow the IDE's dark theme: canvas, decision tables, palette and
  properties panel take the theme's colours, and the bpmn.io watermark stays readable
- Penstock is free on the JetBrains Marketplace. Everything the previous release had stays free,
  and so does everything other tools give away: the editors, the properties panels, templates,
  token simulation, the check panel, lint, deploy, Monitor, export, and going from a Camunda 7
  delegate to its class or bean. **Pro** adds what only Penstock does: diagrams linked to the code
  (from a step to its worker and back, usages, Code Vision, variables and error codes across both,
  tests run from the diagram, coverage on it, linked repositories, Check Workers), flow analysis,
  auto layout, test-case runs, the visual diagram diff and modelling conventions, and in the CLI
  `layout`, `analyze`, `paths`, `tests`, `test-cases`, `code`, `docs`, pictures of changes, `edit` and
  the MCP server; **Team** is what a pipeline needs for all of these, and adds the review bot, pull
  request reports, check baselines and findings in code review. Without Pro the links to the code
  do not appear, and an action that needs them says what they give and offers to buy or sign in
- Every machine starts with 30 days of Pro

### Added
- **Test-case runs** (Pro, Team in a pipeline): Scenarios on the editor's toolbar runs the diagram's scenarios, which are its test cases, against a local
  Camunda 7 or 8 engine, step by step, and shows the run on the diagram - the path taken, a Mocked
  badge on every step a mock answered, and a table of what each step received, sent and changed,
  with where each value came from. Test cases are Camunda Process Test JSON test cases, with
  Penstock's additions in an `x-penstock` block Camunda's tools ignore. Generate writes one scenario
  per way through the process, keeping the ones already in the file
- Run with input... starts an ad-hoc run with start variables and a behaviour per step: the real
  worker, complete, throw a BPMN error, fail a number of times and then complete, or ask; a timer can
  fire at once. The run stops at every step left to ask, and Save as scenario... writes what was
  answered as a scenario that checks the path and the variables. Open run... shows the path and
  steps of an instance that already exists
- Test-case files run in the IDE's test runner, from the gutter of each test case or a folder, with
  a test tree and the log, on the profile in force or the one the run configuration names
- `penstock test-cases` runs the test-case files in a terminal or pipeline, one after another, with
  `--teamcity` for service messages, `--junit-xml` for a report and `--timeout` for how long a step
  may take; `--generate` writes test cases from the ways through each process, and `--junit` writes a
  Camunda Process Test class that runs the same files under JUnit
- `deployment.forTests: true` marks an engine test-case runs may deploy to and answer jobs on. A local
  engine is used once confirmed - in the editor once per profile, in a terminal once per run - and
  never from a pipeline without the mark; any other engine is refused, by the host as well as the editor
- Error codes link code and diagrams. The code in `new BpmnError("...")`, `handleBpmnError(task,
  "...")`, an error command's `errorCode("...")` or `CamundaError.bpmnError("...")` opens the error
  event that catches it, and a code no error event catches is marked. The tool window lists every
  error code with where it is caught and thrown, and marks a code the code throws that nothing
  catches, and an error event nothing throws. The diagram's hover card shows what throws the error
  an event catches
- Monitor on the editor's toolbar shows what the engine of the profile in force is doing with the
  diagram: how many instances wait on each element and how many have an incident, as badges on the
  shapes and in a card with each incident's message. An incident's Code opens the worker that runs
  the task, and the element's hover card says what waits on it. The engine is asked when you open
  Monitor or press Refresh, on Camunda 7 and on Camunda 8.8 and later
- Check Workers in the tool window asks each diagram's engine - the profile in force for the
  diagram's folder, so a project with Camunda 7 and Camunda 8 folders asks both - whether anything
  picks up its tasks: on Camunda 8.9 and later, how many workers took each job type in the last
  day, and which job types had jobs no worker took; on Camunda 7, which topics have tasks waiting
  with no worker locking them. The engine is asked only when you run it, with the profile's
  credentials, and the answer is marked on each worker
- A `@JobWorker` without a `type` whose method name is a job type the diagrams use is marked: the
  job type is then the method name, and renaming the method stops the worker. A quick fix writes
  the type into the annotation
- Job types of Camunda 8 execution and task listeners count as workers, in the tool window and in
  `penstock code`
- Code and diagrams know about each other. A process id, element id, job type or topic, message
  name or decision id in a Java or Kotlin string is a link: Cmd+click or Go to Declaration opens the
  diagram and selects the element, and completion offers the ids where Camunda expects them -
  starting a process, asserting on it in a test (isWaitingAt, hasPassed, hasCompletedElements,
  byId and the rest), @JobWorker and external task subscriptions, correlating a message,
  evaluating a decision. An id that no diagram has is marked. The gutter beside such a string,
  beside a JavaDelegate or bean the diagrams name, and beside a @JobWorker method whose name is
  the job type, jumps to the tasks that use it. Any navigation into a diagram file now selects
  the element on the canvas
- The Penstock tool window shows the project as a model rather than a list of files: the processes
  with the processes they call and are called by, the workers every task needs (a job type, topic,
  class or bean, and Go to Implementation), messages with who catches and throws them, decisions
  and forms with the tasks that use them and references to ones the project does not have, the
  deployment profiles with their addresses and the last deploy, and the files. Double click takes
  you to the element on the diagram. Group by Files turns it round, file by file
- Code Vision above the code the diagrams use: a worker, delegate or bean says which tasks it runs
  and how many tests reach them, and a test says how much of each process it covers. A click opens
  the diagram at the element
- Process variables across the diagrams and the code. Penstock reads where each variable is set and
  read - input and output mappings, conditions, FEEL and JUEL expressions, result variables, form
  fields, message correlation keys, multi-instance collections, call activity in and out, on Camunda
  7 and 8.
  The Penstock tool window lists them with who sets and reads them, marks a variable that is read
  but never set, and asks "set as 'approved'?" when one that is set is a letter away. In code,
  `getVariable`, `setVariable`, `variable`, `@Variable` and the test assertions complete the names
  the diagrams use and link to the elements that use them, and a name a letter away from a known one
  is marked, with a fix
- The code on the diagram, where it does not get in the way. Hovering an element shows what runs it,
  the tests that name it, how often the rest of the code does, the variables it sets and reads and
  whether the tests reach it; Go to Implementation is on its menu. The diagram check lists, under
  Code, a task nothing in the project implements and a variable read under a name that is set a
  letter away
- Other repositories count as part of the project: `linked` in penstock.yaml names them, and their
  diagrams, workers, delegates and beans are read with this one's. Workers written in Java, Kotlin,
  JavaScript, TypeScript, Python, Go or C# are found by reading their text, so a worker in another
  repository, or in a language the IDE does not know, still counts as the task's implementation
- The Penstock tool window runs the project: each process shows its tests and how much of it they
  cover, with the tests listed under it; a Tests section lists every process test by class with what
  each one covers, and runs or debugs any of them, a class or all; Run All Process Tests is on the
  toolbar; Deploy sends a file or a process to its profile, and a profile's Deploy sends every
  diagram to it after asking
- Run Tests and Debug Tests on a diagram element, on the canvas when nothing is picked, and in the
  Penstock tool window run the test methods that name the element or its process with the project's
  own test runner. Debugging them shows on the diagram where the process stops, and the coverage
  follows the run
- Test coverage on the diagram. Once the process tests have run with Camunda Process Test, or on
  Camunda 7 with the process test coverage extension, Coverage on the editor's toolbar colours what
  they reached and dims what they did not, lists the tests with how much of the diagram each one
  covers, shows the way a single test takes when it is picked, and lists the elements no test
  reaches. It reads the reports under `target` or `build` and follows them as the tests run again
- The diagram knows the code that uses it. Find Usages in Code, from an element's menu on the diagram
  or from the Penstock tool window, lists the code that names the element, its process, the job type,
  class or bean it runs, its message or its decision - the worker, the tests, the code that starts
  it. The tool window shows under each job type, topic, class and bean the code that implements it,
  Go to Implementation opens that method rather than the file, and a worker nothing in the project
  implements is marked, once the project implements any of them
- Debugging shows where the process is. When the debugger stops in a job worker, an external task
  handler, a JavaDelegate or a task listener, the diagram marks the task it is running for, with the
  process instance, and on Camunda 7 the other active elements of that instance as well. The
  Penstock tool window lists the same under Debug, and the marks go when the program resumes
- **Process tests** (Pro): `penstock tests` and **Generate Tests** in the IDE write a JUnit class per
  process with a test for every way through it. Each test starts the process with variables chosen
  to take that way - a value just past each condition, and at a default flow a value no other
  condition accepts - completes its jobs, user tasks and external tasks, correlates its messages,
  moves time past its timers, throws errors from jobs where an error boundary is taken, and checks
  the elements it passed. Camunda 8 tests use Camunda Process Test, Camunda 7 tests use
  camunda-bpm-assert with an in-memory engine and mocked delegate beans. A way the data cannot
  choose is marked for the author to finish. The tests go to the diagram's own module, in Kotlin
  or Java as that module already is and in its application's package, and the command names the
  test dependencies the build is missing; `tests:` in `penstock.yaml` sets the language, the folder
  and the package when the guess is wrong
- **Flow analysis** (Pro): the check panel follows every way a token can take through the process
  and reports deadlocks, branches that run twice, steps that can never run and loops with no way
  out, naming the cause and outlining the path that leads there. Also `penstock analyze`, the
  **Analyze Flow** menu item and the `analyze_flow` MCP tool
- **DMN**: `.dmn` files open in a decision editor built on dmn-js — the requirements diagram, decision
  tables with hit policies, typed inputs and outputs and rule annotations, and literal and boxed
  expressions — with a switcher for every decision in the file, the Camunda DMN extensions, and
  saving as you edit. Free, as it is in the Camunda Modeler
- **Decision table checks** (Pro): **Check** in the DMN editor and `penstock analyze` on a `.dmn`
  file find rules of a Unique table that match the same input — and rules of an Any table that do
  so with different results — naming the rules and a value both match, and inputs no rule matches,
  with the values. Cells are read as FEEL unary tests: comparisons, ranges, lists, strings,
  booleans and `not()`; integer columns do not count the space between whole numbers as a gap
- **Camunda Forms**: `.form` files open in a form editor built on form-js — the palette, the canvas
  and the properties panel, saving as you edit, and **Deploy** with the engine settings a diagram
  uses. A `.form` file is taken for a Camunda Form only when it is one, so the IntelliJ GUI
  Designer keeps its own. Free, as it is in the Camunda Modeler
- **Form checks** (Pro): **Check** in the form editor and `penstock analyze` on a `.form` file find
  two fields writing one variable, or a field writing a group's path — a form Tasklist refuses to
  open — fields that write no variable, option lists offering one value twice, and inputs with no
  label. `penstock docs` writes a page per form with the variable every field writes, whether it is
  required, its options and when it is hidden
- Decisions everywhere a diagram goes: **Deploy** in the DMN editor, `.dmn` files in the **BPMN
  Project** tool window, a page per decision file in `penstock docs` — every decision's rules as a
  table, its hit policy in words, what it needs and the table check — and `penstock deploy` sends
  `.dmn` and `.form` files with the diagrams, `--wait` confirming decisions as well as processes.
  `*.bpmn.xml` files are listed and deployed too
- `.bpmn20.xml` files open in the diagram editor, as the command line already read them
- **Decision checks**, part of flow analysis: an exclusive or inclusive gateway with no default
  flow whose conditions leave some value with no way out (`amount > 100` and `amount < 100` stop at
  100), two ways out of an exclusive gateway that can both hold, and two variables that differ only
  by letter case or one character. Simple FEEL and JUEL comparisons, `and`, `or` and `not` are
  read; a decision that cannot be read and has no default is a note
- **Diagram and code checks** (Pro): `penstock code` and **Check Code Links** in the IDE compare
  every diagram with the project's code and report service tasks, listeners and external tasks
  whose job type, topic, class or Spring bean has nothing to run it, call activities that call a
  process no diagram defines, and workers no diagram uses — each with file and line, which the IDE
  opens at the line. A business rule task whose decision no `.dmn` file defines, and a user task
  whose form no `.form` file or embedded form provides, are reported the same way. Workers are read from Java, Kotlin, Groovy, Scala, Python, JavaScript,
  TypeScript, Go and C#; connectors and job types set by an expression are understood. On
  Camunda's own example repository it reports exactly the two tasks that have no worker
- **Scenarios** (Pro): `penstock paths` lists every distinct way through each process with the
  decision taken at each gateway and its condition, as text, JSON or a markdown test checklist;
  also the `list_scenarios` MCP tool
- **Documentation** (Pro): `penstock docs` writes a page per process — picture, steps with what
  runs them and who, decisions and conditions, events, the data each step sets and reads, and
  whether it runs to its end — as a small HTML site or markdown for a wiki
- Buying and signing in without a key to copy: **Tools | Penstock Licence…**, the status bar, or
  `penstock upgrade` / `penstock login` open the checkout, notice the payment and finish with a
  code sent to the e-mail that paid. The IDE and the CLI share the licence
- When every machine a licence allows is in use, signing in lists them and frees the one you
  pick, so a reinstalled machine never uses a licence up
- **Auto Layout** returns, rewritten. It reflows a diagram rather than tidying the coordinates it
  was given: elements are ranked into a left-to-right flow, rows are ordered to cut crossings,
  containers are sized by their contents, and the whole arrangement is then projected through a
  constraint solver so that no two shapes overlap and nothing leaves the pool or lane it belongs
  to. Connections are routed orthogonally around the shapes, message flows are given corridors
  between the pools they connect, and labels, text annotations and their associations are seated
  last, against the routes that were actually drawn
- Auto Layout Preview: the new layout opens in its own editor tab beside the diagram, with a list
  of everything that moved, so it can be read before it is applied
- **Check**, a panel that lists what is wrong with the diagram on screen: shapes on top of each
  other, a connection that does not reach what it connects, an element outside the pool or lane it
  belongs to, a boundary event off its host, labels covering each other. Readability findings —
  crossings, lines sharing a run, detours — are kept apart from those and collapsed, because a
  hand-drawn diagram is allowed to have them. Everything it finds is outlined on the canvas, and
  clicking a line scrolls to it and selects it
- **Go to a delegate class.** A task that names a Java class — `camunda:class`, a delegate
  expression that unwraps to a fully qualified name, an execution or task listener — offers
  *Go to* the class on its context menu, and it opens the file. The class is found by name and
  package in the project's own sources, so the feature needs no Java plugin and works in every
  IDE the plugin runs in
- **Input and output in the Classic profile**, written as BPMN defines it. A task, a sub-process
  or the process itself gains Inputs and Outputs groups that write `bpmn:ioSpecification` with
  `dataInput`, `dataOutput` and the sets that refer to them — no `camunda:` or `zeebe:` extension
  in sight. Camunda 7 and Camunda 8 keep their own editors, which write what those engines read
- Every layout is checked against the rules that make one readable before it is offered: shapes
  that overlap, a connection drawn through a shape or detached from one, an element outside its
  container, a boundary event off its host, a diagonal or doubling-back connection, and any change
  to what the diagram means. The engine is measured on a corpus of 88 real diagrams, where each of
  those is held at zero

## [2.4.1] - 2026-08-31

### Added
- A one-time notification after the plugin updates, offering the changelog in an editor tab.
  Nothing is shown on a fresh install
- Third-party license notices bundled with the plugin and viewable from
  Settings | Tools | Penstock | About | Open source licenses, generated from the
  installed packages and including a written source offer for the LGPL-licensed components

### Changed
- Renamed from "Camunda BPMN Editor" to **Penstock**. The plugin ID is unchanged, so the rename
  arrives as an ordinary update and keeps every existing installation, review, and download
- The plugin is now distributed under a proprietary end-user license agreement instead of MIT
- Both compatibility variants now carry the paid `product-descriptor`; the 2026.2+ build had been
  shipping without it and would have been listed as free
- The Marketplace description, change notes, and product descriptor are injected at build time from
  a single source, and the second `plugin.xml` is generated from the first, so the two variants can
  no longer drift apart

### Removed
- Dropped four unused frontend dependencies (`@dagrejs/dagre`, `elkjs`, `web-worker`,
  `classnames`), which also removes the last EPL/GPL-licensed component from the distribution

### Fixed
- Restored the bpmn.io watermark, which the editor stylesheet had been hiding contrary to the
  bpmn-js license
- Replaced the deprecated `ReadAction.compute`/`ReadAction.run` and `SimpleListCellRenderer.create`
  calls; the plugin now verifies as Compatible with no deprecated or internal API usages on 2025.2,
  2026.1, and 2026.2

## [2.3.7] - 2026-08-27

### Changed
- Re-added the paid `product-descriptor` (code, release-date, release-version) per JetBrains Marketplace support: vendor/banking details are now verified, and the Sales tab only unlocks after a build with these parameters is uploaded. No in-app license check — the platform enforces licensing on its own (and grants unlicensed users a 30-day trial), so the custom `CheckLicense`/"Buy License" panel from 2.3.3 isn't needed.

## [2.3.5] - 2026-08-27

### Changed
- Reverted the license enforcement added in 2.3.3: JetBrains Marketplace hasn't yet enabled selling for this plugin (no Sales tab / pricing plan available), so shipping a license-gated build now would have left updated users unable to open BPMN diagrams *or* buy a license. The plugin is free again until monetization is actually live; license enforcement will return in a future release once pricing is enabled on Marketplace.

## [2.3.3] - 2026-08-27

### Changed
- Plugin registered as Fully Paid on JetBrains Marketplace: removed the free read-only viewer mode added for the (never-published) Freemium plan — a valid license is now required to open BPMN diagrams at all. Unlicensed users see a "Buy License" prompt instead of a degraded editor.
- `product-descriptor` `optional` flag set to `false` to match the registered pricing model

## [2.3.1] - 2026-08-27

### Fixed
- Restored the ability to switch between the diagram and the raw XML/text editor for `.bpmn` files — a 2025-12-29 recovery after an accidental file deletion had silently swapped the editor policy to `HIDE_DEFAULT_EDITOR`, hiding the default XML editor tab entirely

### Changed
- Updated Gradle plugins (OpenAPI Generator 7.25.0, Spring Boot 4.1.1) and webview dependencies (bpmn-js, camunda-bpmn-js, bpmn-js-properties-panel, bpmnlint, and others) to their latest compatible releases

## [2.3.0] - 2026-07-30

### Added
- Freemium licensing: without a license, the editor opens as a read-only viewer (pan/zoom, no editing) with an upgrade banner; a valid license unlocks the full editor unchanged
- Product descriptor and vendor ID added to plugin.xml for JetBrains Marketplace monetization

### Changed
- License check is defensively wrapped so a licensing failure degrades to the free viewer instead of breaking the editor entirely

## [2.2.0] - 2026-07-29

### Added
- External file change detection: editing a `.bpmn` file outside the IDE (git checkout/pull, another editor) now prompts to reload instead of silently overwriting it on the next autosave
- Support for WebStorm/IntelliJ IDEA 2026.2 and later (published as a second compatibility variant of the plugin, alongside the existing 2025.2–2026.1 build)

### Changed
- Token Simulation now blocks Undo/Redo/Copy/Paste/Delete/Auto Layout while a simulation is running, instead of silently allowing edits to the real diagram
- BPMN Lint now requires trusting the project first, and no longer allows starting a second run on a file that's still linting
- Settings dialog writes and the webview's own config reads/writes are now properly synchronized (closes a gap left by the 2.1.0 fix)
- Autosave debounce shortened from 400ms to 200ms

### Fixed
- Fixed "Save and Continue" doing nothing after selecting an engine on first-time project setup — the actual failure was being silently swallowed, and a redundant background request could report an error even after the save had already succeeded
- Fixed a renamed/moved BPMN file resurrecting a stale copy at its old path on the next autosave
- Fixed several usages of deprecated platform APIs (`ReadAction.compute`/`run`, `SimpleListCellRenderer.create`) and an incorrect `since-build` declaration

## [2.1.0] - 2026-07-16

### Architecture
- Restructured to flat module layout: `jetbrains/`, `webview/`, `sandbox/`
- Removed `backend/` wrapper directory
- PlatformBridge abstraction — webview is platform-agnostic
- HttpPlatformBridge for JetBrains CEF + sandbox (fetch-based)
- Bridge injection API for future VSCode support
- Each platform module owns its build (decoupled from root)
- Module READMEs with architecture docs

### Added
- Copy/paste now syncs through the OS clipboard (IntelliJ `CopyPasteManager`), so elements can be copied in one diagram tab and pasted into another
- `.editorconfig`, CONTRIBUTING.md, CODE_OF_CONDUCT.md, SECURITY.md
- GitHub issue/PR templates

### Changed
- All dependencies updated to latest versions
- Kotlin 2.4.10, IntelliJ Platform Plugin 2.18.1, IntelliJ IDEA SDK 2026.1.4
- Spring Boot 3.4.1 → 4.1.0 (sandbox)
- Frontend: Vite 7 → 8.1, TypeScript 5 → 6, ESLint 9 → 10.7, Node.js 24 LTS (24.18)
- Gradle wrapper 9.2.1 → 9.6.1
- CEF Generator upgraded to 3.1.1, OpenAPI Generator upgraded to 7.23.0
- bpmn-js/camunda-bpmn-js and the properties panel updated to their latest releases
- Redesigned toolbar with a more compact, icon-based layout
- Updated Camunda connector element templates to the latest upstream release

### Removed
- Deploy and Auto Layout toolbar actions temporarily hidden — returning in a future release

### Fixed
- Kotlin idioms: computed properties, `Unit`, `jacksonObjectMapper()`
- Unified logging to IntelliJ `Logger.getInstance`
- Removed hardcoded `gradle.java.home`, duplicate `.gitignore`, `lombok.config`
- Crash when pasting a copied pool/participant into a different editor tab
- Paste occasionally re-inserting a previously copied element instead of the current clipboard content
- CEF browser resources not being released when a project closes
- Tightened CORS origin validation on the plugin's local API

## [2.0.1] - 2025-12-15

### Fixed
- Opening Camunda 7 scripts in external tab

## [2.0.0] - 2025-12-01

### Added
- Element templates support for Camunda 8
- Tool window for managing BPMN diagrams in project

### Changed
- Updated component design
- Updated library versions

## [1.4.4] - 2025-09-15

### Fixed
- Base64 encoding

### Added
- Custom file logo

## [1.4.3] - 2025-09-01

### Added
- Toolbar (can be hidden) and context menu
- Export to SVG

### Fixed
- Chinese language support

## [1.4.2] - 2025-08-15

### Added
- BPMN Linter integration

### Fixed
- Copy/paste elements between diagrams

## [1.4.1] - 2025-08-01

### Added
- Dracula theme
- Sketchy schema theme (disabled by default)

## [1.4.0] - 2025-07-15

### Changed
- Performance and size optimizations
- Refactored init JS queries and context

## [1.3.1] - 2025-07-01

### Fixed
- Performance improvements
- Copy/paste between diagrams

## [1.3.0] - 2025-06-15

### Fixed
- Performance (project context, UI build optimization)

## [1.2.0] - 2025-06-01

### Changed
- Migrated from Spring context to PicoContainer

### Fixed
- Dark theme styles

## [1.1.0] - 2025-05-15

### Added
- Token simulation support

### Fixed
- Dark theme styles

[Unreleased]: https://github.com/kern0x1b/penstock/compare/v2.4.1...HEAD
[2.4.1]: https://github.com/kern0x1b/penstock/compare/v2.3.7...v2.4.1
[2.3.7]: https://github.com/kern0x1b/penstock/compare/v2.3.5...v2.3.7
[2.3.5]: https://github.com/kern0x1b/penstock/compare/v2.3.3...v2.3.5
[2.3.3]: https://github.com/kern0x1b/penstock/compare/v2.3.1...v2.3.3
[2.3.1]: https://github.com/kern0x1b/penstock/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/kern0x1b/penstock/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/kern0x1b/penstock/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/kern0x1b/penstock/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/kern0x1b/penstock/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/kern0x1b/penstock/compare/v1.4.4...v2.0.0
[1.4.4]: https://github.com/kern0x1b/penstock/compare/v1.4.3...v1.4.4
[1.4.3]: https://github.com/kern0x1b/penstock/compare/v1.4.2...v1.4.3
[1.4.2]: https://github.com/kern0x1b/penstock/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/kern0x1b/penstock/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/kern0x1b/penstock/compare/v1.3.1...v1.4.0
[1.3.1]: https://github.com/kern0x1b/penstock/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/kern0x1b/penstock/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/kern0x1b/penstock/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/kern0x1b/penstock/releases/tag/v1.1.0
