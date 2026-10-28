# JetBrains Marketplace captions

Frames are 2880x1736 PNG (the whole IntelliJ IDEA 2026.2 window at 2x, with its title bar), taken from a real IDE in the New UI (Islands Light) running Penstock on the `retail-fulfilment` fixture. The Project tool window is open in every frame. Light theme only.

| File | Caption | Tier note |
|---|---|---|
| 01-bpmn-editor.png | Penstock in IntelliJ IDEA: the BPMN editor next to the Project tool window, with the palette, the toolbar, the Properties tab and the AI chat input at the foot of the editor. | Editor free |
| 02-check-problems.png | bpmnlint with your own rules and the flow analysis, on the element each finding is about. | Rules free; flow analysis Pro |
| 03-dmn-decision-table.png | Edit decision tables and try them with real values; the matching rules are marked. | Free |
| 04-form-preview.png | Design Camunda forms with a live preview. | Free |
| 05-scenarios.png | Scenarios: the test cases of a diagram, listed beside it and run in the IDE. | Pro |
| 06-flow-analysis.png | Find deadlocks before production. The path to the problem is outlined on the diagram. | Pro |
| 07-ai-chat.png | Ask your own AI agent about any diagram. You review every change. | Sending needs Pro |

Frame 07's answer comes from a scripted stand-in agent (`docs/marketplace/ide/scripted-agent.ts` in the product repository, registered as a custom ACP agent), not from a model. Pro features show because the machine was inside its 30-day trial.
