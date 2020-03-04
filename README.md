
[strong checkmark]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[strong cross]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[hammer & pick]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[pick]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[three lines right]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[three lines left]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[warning]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)
[gear]: <> (<img src="https://api.iconify.design/si-glyph:pick.svg"/>)

## rff-demo-project

This is my pet project. It's also my Fullstack 2019 course project.

I created it to learn new things and represent my skills both in front- & backend programming.

### pieces:
- Nodejs/Express backend with Apollo Server
- React/Redux frontend with Apollo Client
- MongoDB-Apollo Cloud remote database

legend | 
------ | 
done: &#x2714; |
upcoming: &#x26CF; | 
modified: &#9881; | 
ongoing: &#9874; | 
might not be stable: &#x26A0; |

### features:

feature | status:backend | status:frontend
:------ | :------------: | :-------------:
login | &#x2714; , &#9881; | &#x2714;
registering | &#x2714; | &#x2714;
usergroups | &#x2714; | &#x26CF;
task lists (and tasks), private & group | &#x2714; | &#9874;
dish suggestions | &#x2714; | &#9874; , &#x26A0;
public transport: stop timetables & disruption info |  | &#9874;
simple calculator (two values, answers for most common calculations) | | &#x2714;
implementation of country information viewer | | &#x2714;
admin tools (applications status, user & group management) | &#x2714; | &#9874;
about-page | | &#x2714;
`EN`/`FI`-translations | | `EN` &#x2714; , `FI` &#x26CF;

### breakdown:
part | status
:--- | :----:
[backend](https://github.com/RedFoxFinn/rff-project/tree/backend) | ![CI Status](https://github.com/RedFoxFinn/rff-project/workflows/CI:backend/badge.svg?branch=backend)
[frontend](https://github.com/RedFoxFinn/rff-project/tree/frontend) | ![CI Status](https://github.com/RedFoxFinn/rff-project/workflows/CI:frontend/badge.svg?branch=frontend)
[staging](https://github.com/RedFoxFinn/rff-project/tree/staging) | ![CI status](https://github.com/RedFoxFinn/rff-project/workflows/CI:stage/badge.svg?branch=staging)
[live project](https://kettula.herokuapp.com/) | &#x26A0;
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
'20.02.27-28 | 8 | staging: fixing tests, adding carb fails due input typing, adding other dish components fail due not visible notification; backend: fixed dish component usage
'20.03.02 | 6 | staging: integration tests failing (notification); frontend: added User-class to Redux-state to bring more functionality, started building Tasker logic & GraphQL-functionalities
'20.03.03 | 9 | frontend: continued with tasker visuals & GraphQL; project README's: added unicode symbols to act as status markers
 | | 
total | 261 | 

[![Huge credits to FullStack open](https://img.shields.io/badge/MOOC-Uni_Helsinki-1f425f.svg)](https://fullstackopen.com/)
[![Trusted tool in development](https://img.shields.io/badge/Made%20with-WebStorm-5ee0bd.svg)](https://www.jetbrains.com/webstorm)
[![Fun & useful markdown thingy](https://img.shields.io/badge/badges-awesome-orange.svg)](https://shields.io/)
