
## rff-demo-project

This is my pet project. It's also my Fullstack 2019 course project.

I created it to learn new things and represent my skills both in front- & backend programming.

### pieces:
- Nodejs/Express backend with Apollo Server
- React/Redux frontend with Apollo Client
- MongoDB-Apollo Cloud remote database

### features:
feature | status
:------ | :----:
login | `done`,`tweaked`
registering | `done`
usergroups | `backend:done`
task lists (and tasks), private & group | `backend:done`
dish suggestions | `done`
public transport: stop timetables & disruption info | `ongoing`
simple calculator (two values, answers for most common calculations) | `done`
implementation of country information viewer | `done`
admin tools (applications status, user & group management) | `ongoing`
about-page | `done`

### breakdown:
part | status
:--- | :----:
[backend](https://github.com/RedFoxFinn/rff-project/tree/backend) | ![CI Status](https://github.com/RedFoxFinn/rff-project/workflows/CI:backend/badge.svg?branch=backend)
[frontend](https://github.com/RedFoxFinn/rff-project/tree/frontend) | ![CI Status](https://github.com/RedFoxFinn/rff-project/workflows/CI:frontend/badge.svg?branch=frontend)
[staging](https://github.com/RedFoxFinn/rff-project/tree/staging) | ![CI status](https://github.com/RedFoxFinn/rff-project/workflows/CI:stage/badge.svg?branch=staging)
[live project](https://kettula.herokuapp.com/) | 
version | ![Page version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/RedFoxFinn/rff-project/frontend/package.json&query=version&color=61bd51&label=frontend)![Page version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/RedFoxFinn/rff-project/backend/package.json&query=version&color=61bd51&label=backend)

### timesheet:
date | work hours | features worked on
:--- | :--------: | -----------------:
'19.10.26/27 | 6 | backend: server main file, mongoose models, graphql schema & resolvers
'19.10.27 | 5 | backend: graphql schema & resolvers
'19.10.28 | 13 | backend: graphql schema & resolvers, server-file, config, routing, backend.md
'19.10.29 | 7 | backend -> tests init
'19.10.30 | 3.5 | backend: continued tests init
'19.10.31 | 7 | backend: continued tests init
'19.11.01 | 9 | backend-tests: `api` (testing), `utils` (init tests), `server` (init tests)
'19.11.07 | 9.5 | backend-tests: `api` (testing)
'19.11.08 | 8 | backend-tests: `api` (testing)
'19.11.11 | 8 | backend-tests: `api` (dish:testing)
'19.11.13 | 8 | backend-test: `api` (testing)
'19.11.14 | 9 | backend-test: `api` (testing)
'19.11.18 | 0.5 | backend-test: `api` (testing)
'19.11.19 | 8 | backend: `done; waiting frontend`; frontend: started
'19.11.20 | 6 | frontend: applications
'19.11.21 | 8 | frontend: applications
'19.11.25 | 10 | frontend: applications designing & building; priming apollo-client
'19.12.03 | 8.5 | frontend: OpenCountries - done; CRA default application removed from codebase; README updated
'19.12.04 | 6 | frontend: CountryCount, IngredientCount, MethodCount - done; started building apollo-client functionalities & declaring graphql mutations, queries, subscriptions, fragments; added classes; README updated
'19.12.10 | 9 | frontend: mutation, query, subscription, fragment definitions - done; creating visuals for dishy app; some restructuring of project; backend: minor tweaks;
'20.01.08 | 3 | backend: added field 'stops' to users, added functionality to add or remove stops from users, added functionality to activate/deactivate users, tests done for new functionalities & features
'20.01.13 | 7 | small backend tweaks, frontend: login-page (done), added registering
'20.01.14 | 3.5 | login: connected to backend, tweaked styling, added UserSetting-page
'20.01.15 | 5.5 | login: tweaked functionality -done, registering: tweaked functionality & connected to backend - done, UserSettings: added functionality to change username & password & connected to backend & tweaked styling
'20.01.17 | 4 | package.json updated, GitHub Action CI setup for backend: automated test running + status badge
'20.01.20 | 7 | backend: counter tweaks; frontend: more graphql-functionality, tweaked visuals, added more data rendering
'20.01.22 | 4 | frontend: updated more consistent styling for OpenCounties, started tasker; issues: up-to-date; ISSUE: tasker api faulty? (error occurred while loading private lists && error occurred while loading group lists)
'20.01.24 | 8 | frontend: tasker issue solved (fragment-related problem), added visuals to tasker, added Cypress to project for testing, started building e2e tests, added IDs for various elements in Login & Registration to help Cypress
'20.01.27-31 && '20.02.01 | 10 | frontend: graphql queries & mutations for dishy & tasker, visuals & restyling for dishy & tasker, building functionalities & subcomponents for tasker & dishy, added new CSS files for restructuring styling
'20.02.10-11 | 7 | frontend: styling tweaking, test & functionality building
'20.02.12 | 7 | frontend: tests refactoring & building, added new frontend GitHub Actions CI to project
'20.02.14 | 7 | backend CI checked, frontend CI checked & tweaked, build CI created & edited, fixed Content Security Protocol errors with build.
'20.02.17-21 | 10 | frontend & backend: prepping for staging, altering workflows; frontend: reorganizing testing, integration tests separated to staging;
'20.02.25 | 6 | frontend: dishy gained subscriptions
 | | 
total | 238 | 

[![Huge credits to FullStack open](https://img.shields.io/badge/MOOC-Uni_Helsinki-1f425f.svg)](https://fullstackopen.com/)
[![Trusted tool in development](https://img.shields.io/badge/Made%20with-WebStorm-5ee0bd.svg)](https://www.jetbrains.com/webstorm)
[![Fun & useful markdown thingy](https://img.shields.io/badge/badges-awesome-orange.svg)](https://shields.io/)
