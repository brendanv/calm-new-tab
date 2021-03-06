# Calm New Tab

Replace your new tab page with a relaxing photo. No frills, no tracking, open source.

<p align="center"><img src="screenshots/1.png"></p>

## Development

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Install [yarn](https://yarnpkg.com/en/docs/install) for building the extension.
- Register as a developer on [Unsplash](https://unsplash.com/developers) and obtain API keys.
- Copy `API_KEYS.js.sample` to `API_KEYS.js` and add your new keys to the exported object.

### Building the extension

The first step is to build the extension into the `build/` directory. The `watch` command will re-build the extension whenever files in the project directory are changed.

```
yarn run watch
```

After the initial build has completed, follow the instructions for loading an extension from the `build/` directory into [Chrome](https://developer.chrome.com/extensions/getstarted#unpacked) or [Firefox](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox).

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](./LICENSE.md) file for details.

### Note about license

From @brendanv: I am providing code in this repository to you under an open source license. Because this is my personal repository, the license you receive to my code is from me and not from my employer (Facebook).
