# Mono

> Monorepo containing bloxifi's client-side code

## Intro

This repo utilizes `lerna` and `yarn workspaces` for all its monorepo needs.

Primary technologies include:

- [TypeScript](https://typescriptlang.org)
- [React](https://reactjs.org/docs/getting-started.html)
- [Styled Components](https://styled-components.com/docs)
- [Jest](https://jestjs.io/docs/en/getting-started)
- [Cypress](https://docs.cypress.io/guides/getting-started/writing-your-first-test.html#Add-a-test-file)

## Getting started

After cloning the repo, run `yarn` inside the repo root.
The repo is organized into `apps/` and `packages/`. `packages/` contain all re-usable code across the codebase, while `apps/` contain all applications.


Each app has a `serve` and `build` npm script and by utilising `lerna` we can build all apps in parallel by running `yarn build` in the repository root, or spin up a development server `yarn serve`

Summary

1. Install node.js https://www.webucator.com/how-to/how-install-nodejs-on-mac.cfm or run in Terminal: `brew install node`
2. run in Terminal command: `npm install --global yarn`
3. `git clone git@github.com:BloxiFi/bloxifi-fe.git`
4. in root folder run command: `yarn && yarn lerna bootstrap`
6. run command: `yarn serve` in root folder

#### **NOTE: Required node version to run this project is node 14 or node 16.**

### Storybook

You can see all storybook components used in project [here](http://bloxifi-storybook.s3-website.eu-central-1.amazonaws.com/)

## Code guidelines

We use ESLint for linting and Prettier for formatting our code, specifics can be seen in respective configs.
