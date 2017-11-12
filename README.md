# Calm New Tab

Replace your new tab page with a relaxing photo. No frills, no tracking, open source.

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

