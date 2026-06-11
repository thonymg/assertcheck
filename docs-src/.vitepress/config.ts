import { defineConfig } from "vitepress"

export default defineConfig({
  title: "assertcheck",
  description:
    "Negative Space Programming for TypeScript — declare invalid states, fail fast, trust the boundary.",
  lang: "en-US",
  base: "/assertcheck/",
  ignoreDeadLinks: [/\/api\/@assertcheck\//],

  head: [["link", { rel: "icon", href: "/logo.svg" }]],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: "assertcheck",

    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/api/" },
      { text: "Skills", link: "/skills/" },
      { text: "Changelog", link: "https://github.com/thonymg/assertcheck/releases" },
      { text: "Vagabond Studio", link: "https://vagabond.work" },
    ],

    sidebar: {
      "/guide/": [
        {
          text: "Introduction",
          items: [
            { text: "Getting started", link: "/guide/getting-started" },
            { text: "Installation", link: "/guide/installation" },
          ],
        },
        {
          text: "Core concepts",
          items: [
            { text: "Negative Space Programming", link: "/guide/negative-space" },
            { text: "Assertion modes", link: "/guide/modes" },
            { text: "Error format", link: "/guide/error-format" },
            { text: "Chainable API (check)", link: "/guide/check" },
          ],
        },
        {
          text: "Recipes",
          items: [
            { text: "Custom assertions", link: "/guide/custom-assertions" },
          ],
        },
      ],
      "/skills/": [
        {
          text: "AI Workflows",
          items: [
            { text: "Overview", link: "/skills/" },
          ],
        },
        {
          text: "Skills",
          items: [
            { text: "assertcheck-feature", link: "/skills/feature" },
            { text: "assertcheck-audit", link: "/skills/audit" },
            { text: "assertcheck-spec", link: "/skills/spec" },
            { text: "assertcheck-refactor", link: "/skills/refactor" },
            { text: "assertcheck-selector", link: "/skills/selector" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API Reference",
          items: [{ text: "Overview", link: "/api/" }],
        },
        {
          text: "assert",
          items: [
            { text: "Overview", link: "/api/@assertcheck/namespaces/assert/_generated" },
            { text: "equal / deepEqual", link: "/api/@assertcheck/namespaces/assert/functions/equal" },
            { text: "nil / notNil / empty", link: "/api/@assertcheck/namespaces/assert/functions/nil" },
            { text: "all / any / none", link: "/api/@assertcheck/namespaces/assert/functions/all" },
            { text: "hasKey / hasKeys", link: "/api/@assertcheck/namespaces/assert/functions/hasKey" },
            { text: "not", link: "/api/@assertcheck/namespaces/assert/functions/not" },
          ],
        },
        {
          text: "check()",
          items: [
            { text: "check()", link: "/api/functions/check" },
            { text: "ArrayChecker", link: "/api/classes/ArrayChecker" },
            { text: "ObjectChecker", link: "/api/classes/ObjectChecker" },
            { text: "Checker (base)", link: "/api/classes/Checker" },
          ],
        },
        {
          text: "Mode",
          items: [
            { text: "modeAssertIn()", link: "/api/functions/modeAssertIn" },
            { text: "setAssertMode()", link: "/api/functions/setAssertMode" },
            { text: "getAssertMode()", link: "/api/functions/getAssertMode" },
          ],
        },
        {
          text: "Errors & formatting",
          items: [
            { text: "AssertionError", link: "/api/classes/AssertionError" },
            { text: "buildBlock()", link: "/api/functions/buildBlock" },
            { text: "fmtValue()", link: "/api/functions/fmtValue" },
          ],
        },
        {
          text: "Types",
          items: [
            { text: "AssertOptions", link: "/api/interfaces/AssertOptions" },
            { text: "AssertMode", link: "/api/type-aliases/AssertMode" },
            { text: "Env", link: "/api/type-aliases/Env" },
          ],
        },
      ],
    },

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/thonymg/assertcheck/",
        ariaLabel: "GitHub",
      },
      {
        icon: "npm",
        link: "https://www.npmjs.com/package/assertcheck",
        ariaLabel: "npm package",
      },
      {
        icon: "linkedin",
        link: "https://www.linkedin.com/company/105997457/",
        ariaLabel: "LinkedIn",
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2s.06-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/></svg>',
        },
        link: "https://vagabond.work",
        ariaLabel: "Vagabond Studio",
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>',
        },
        link: "mailto:hello@vagabond.work",
        ariaLabel: "Send us an email",
      },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5C3.89 4 3.01 4.9 3.01 6L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm-7-8h-2v2H8v2h2v2h2v-2h2v-2h-2z"/></svg>',
        },
        link: "https://calendly.com/vagabond-studio/appel-de-decouverte-vagabond-studio",
        ariaLabel: "Book a discovery call",
      },
    ],

    footer: {
      message: "Released under the Apache 2.0 License. Built by <a href=\"https://vagabond.work\" target=\"_blank\">Vagabond Studio</a> — senior-only for growing companies.",
      copyright: "Copyright © 2026",
    },

    search: { provider: "local" },
  },
})
