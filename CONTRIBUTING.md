# How to contribute?

## Prerequisites

> [!NOTE]
> We're using Yarn as the package manager in this project &mdash; this is necessary
> because our `steam-totp` implementation has to be patched before building the plugin.
> A Yarn v4 minified executable is bundled within the repository; it is sufficient
> for you to have at least the v1 version (legacy) installed, and it should automatically
> pick up the version in `.yarn/releases` without issue.

Clone the repository and install dependencies:

```shell
git clone git@github.com:dreamscached/obsidian-simple-steam-auth
yarn install
```

## Submitting a pull request

Before preparing a new pull request, please note that all of our changes first appear on
the `dev` branch before they are merged into `master` for a new release. With that in mind,
ensure you start your work by branching off the `dev` branch. When submitting your
pull request, make sure to set the target branch to `dev`. Thank you! 🫶

## Adding translations

We welcome translation contributions! This section will guide you through the process.
Let's suppose you want to add a German translation:

1. Open the [`src/assets/i18n`](src/assets/i18n) folder &mdash; this is where our translation
   files live.

2. Copy the `en.json` file (our baseline English translation) to a new file named `de.json`,
   where `de` is the 2-letter language code (note: you may need a specifier like `en-US` for
   specific language dialects/variants).

3. Open your `de.json` file and translate the strings into your language.

4. Open the [`src/lib/i18n.ts`](src/lib/i18n.ts) file, find the `resources` map, and add the
   entry for your language like this:

    ```ts
    "de": ((await import("$assets/i18n/de.json", { with: { type: "json" } })) as any).default
    ```

5. (This is optional, but it will save us a few minutes! 🫶) <br>
   Open [`i18next.config.ts`](i18next.config.ts) and add your language code (corresponding to
   your `.json` file name) to the `locales:` list.

6. Submit a pull request. You're amazing! 🎉
