# Security Policy

## Reporting a vulnerability

Report suspected vulnerabilities in Penstock to
**157722763+kern0x1b@users.noreply.github.com**. Do not open a public issue and do not post
details on the JetBrains Marketplace page.

Include whatever you have: affected plugin version and IDE build, steps to reproduce, and the
impact you believe the issue has. A minimal `.bpmn` file or project that triggers the behaviour is
the most useful thing you can send.

You can also use
[GitHub Security Advisories](https://github.com/kern0x1b/penstock-release/security/advisories/new)
on this repository, which keeps the report private until a fix ships.

## What to expect

| Stage | Target |
|---|---|
| Acknowledgement of your report | 3 business days |
| Initial assessment and severity | 10 business days |
| Fix released, or a dated plan if the fix takes longer | 90 days |

You will be told when the fix ships. If you want credit in the release notes, say so in your
report; reports are otherwise handled without attribution.

We ask that you give us 90 days before disclosing publicly, and we will not ask you to sign an NDA
or to stay silent indefinitely. If a vulnerability is being exploited, we will move faster and
coordinate the announcement with you.

## Safe harbour

We will not pursue or support legal action against anyone who, in good faith, discovers and
reports a vulnerability under this policy, provided you:

- test only against your own IDE installation and your own BPMN files;
- do not access, modify, or exfiltrate data belonging to anyone else;
- do not degrade the service of any third party, including Camunda engines you do not own;
- give us reasonable time to respond before disclosing.

If you are unsure whether something is in scope, ask before testing.

## Supported versions

| Version | Supported |
|---------|-----------|
| 2.3.x   | Yes       |
| < 2.3   | No        |

Fixes ship in the current release line only. Because the plugin is published in two compatibility
variants, a security fix is released as a pair of builds, one for IDEs 2025.2-2026.1 and one for
2026.2 and later.

## Scope

In scope:

- the plugin's local HTTP API and its origin/CORS handling;
- the JCEF-hosted editor and any content it loads;
- parsing and rendering of untrusted `.bpmn` files;
- handling of deployment credentials and their storage in the IDE password safe;
- execution of project-supplied bpmnlint configuration and plugins.

Out of scope:

- vulnerabilities in the IntelliJ Platform itself: report those to
  [JetBrains](https://www.jetbrains.com/legal/docs/terms/vulnerability-disclosure/);
- vulnerabilities in bundled open-source components, unless the plugin's use of them creates the
  issue: report those upstream, and tell us so we can update;
- findings that require an attacker to already have local code execution as the user;
- issues in a Camunda engine you deploy to.

## Design notes

The plugin runs locally. The JCEF browser loads plugin resources from `https://local.bpmn`, and
the plugin makes no outbound network calls of its own. Diagrams leave the machine only when you
explicitly deploy them, and only to the engine endpoint you configure. Deployment credentials are
stored in the IDE password safe, never in project configuration files. bpmnlint runs only after
the project is trusted.
