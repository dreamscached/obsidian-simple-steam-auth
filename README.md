# 🔑 Simple Steam Auth

![Latest release](https://img.shields.io/github/v/release/dreamscached/obsidian-simple-steam-auth)
![Download count](https://img.shields.io/github/downloads/dreamscached/obsidian-simple-steam-auth/main.js)

Dynamic, real-time updated Steam Guard code component right in your
Obsidian notes!

## 🤔 Why?

You'll find this plugin extremely convenient if you have more than one
Steam account and need to switch between them often, especially if
you're a bot (e.g. automated trading) developer and keep a couple
dozen of these codes in your vault.

## 🎞️ Demo

| Hover-to-reveal                                  | Always revealed                                   |
| ------------------------------------------------ | ------------------------------------------------- |
| ![Hover-reveal demo](docs/screenshots/demo2.gif) | ![Revealed code demo](docs/screenshots/demo1.png) |

## 📦 How to install

### 🐈‍⬛ From Github

1. Go to [latest release page](https://github.com/dreamscached/obsidian-simple-steam-auth/releases/latest)
2. Scroll to the bottom and download the `simple-steam-auth-v1.x.x.zip` package
3. Unpack the `simple-steam-auth` folder from the package into `<vault folder>/.obsidian/plugins`
4. Enable Simple Steam Auth in Community plugins settings tab

## 📓 How to use

> [!NOTE]
> You are expected to be familiar with where to obtain the _shared_
> secret for your Steam account. If not &mdash; see [this](https://gist.github.com/mathielo/8367e464baa73941a075bae4dd5eed90)
> extensive guide.

After installing this plugin, simply create an _inline_ code block
with the following content inside the backticks:

```
::steam-guard-code::YOUR_SHARED_SECRET_HERE
```

That's it, now you have a quick access to your Steam Guard code.

## 🔒 Security considerations

Steam Guard codes are always generated locally, using the
cryptographic secret you've provided. Neither this secret nor the
generated code ever leaves your device.

However, be wary of the software (including other plugins) that can
potentially access your Obsidian vault and steal your secret, as
well as other people who may look at your device's screen and see
the code.

## 📜 Acknowledgements

During the development, some inspiration (for various code parts)
was drawn from the following plugins:

- [Dataview](https://github.com/blacksmithgu/obsidian-dataview) &mdash;
  live preview/source mode separation, inline code span replacement
