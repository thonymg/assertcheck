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
      { text: "Changelog", link: "https://github.com/assertcheck/core/releases" },
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

    socialLinks: [{ icon: "github", link: "https://github.com/assertcheck/core" }],

    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present assertcheck contributors",
    },

    search: { provider: "local" },
  },
})
