# ANU Unofficial Timetable

[![Website status](https://img.shields.io/website?url=https%3A%2F%2Ftimetable.cssa.club&up_message=online&down_message=offline&style=flat-square&logo=microsoft-azure)](https://timetable.cssa.club)
[![Build status](https://img.shields.io/github/actions/workflow/status/pl4nty/anutimetable/build_and_deploy.yml?style=flat-square&logo=github)](https://github.com/pl4nty/anutimetable/actions/workflows/build_and_deploy.yml)
[![Scraper status](https://img.shields.io/github/actions/workflow/status/pl4nty/anutimetable/scrape.yml?style=flat-square&logo=github&logoColor=white&label=scraper)](https://github.com/pl4nty/anutimetable/actions/workflows/scrape.yml)

## About

This is an unofficial alternative timetable viewer for the Australian National University built by members of the
[ANU Computer Science Students' Association](https://cssa.club/). It's available [here](https://timetable.cssa.club/).
It serves as an up-to-date (automatically updated each day), fast, easy to use alternative to the
[(old) official timetable](http://timetabling.anu.edu.au/sws2025/). It replaces the *old* unofficial timetable
[here](https://anutimetable.com/) which has not been updated since 2021.

## Development

> [!IMPORTANT]
> The source of the course data is currently the [old timetable
> (timetabling.anu.edu.au)](https://timetabling.anu.edu.au/sws2025/), so there will be differences between this
> timetable and [MyTimetable](https://mytimetable.anu.edu.au/odd/timetable/). Particularly, some courses are, for
> whatever reason, not added there, and there is currently nothing we can do to add them to this timetable.
>
> We will be switching to new APIs with a planned rewrite, so this issue should be eventually resolved. In the meantime,
> if in doubt, refer to MyTimetable.

**Components:**

* A React.js front-end in `/src` and `/public`. It's hosted as an Azure Static Web App by @pl4nty (free tier). Commits to master are deployed to timetable.cssa.club minutes later via a GitHub Action. Commits to open PR's are pushed to staging URL's for testing.
* A Python scraping script in `scraper` inherited from anutimetable.com that scrapes the official ANU timetable website. It is run once a day by a GitHub Action and the results are saved to `public/timetable*.json`.
* Several Azure functions in `/api` hosted by @pl4nty (free tier plan). These generate useful data on the fly like the calendar exports (`GetICS`) which can be linked to your calendar software (so they automatically update) or downloaded (as an ICS file).

**Local development:**

* First time setup
  * Install `node`
  * Navigate to the root of the repo and run `npm ci`
  * Navigate to the `api` subfolder and run `npm ci` again
  * Run `sudo npm i -g @azure/static-web-apps-cli azure-functions-core-tools`
* Running it
  * In VSCode, open the repo and press the run button (F5)
  * In other editors, run the commands in the `.vscode` config in a terminal

**Future directions:**

* Move away from Azure functions (to client side logic and GitHub Actions where possible)
* The [Class Allocation Project](https://services.anu.edu.au/planning-governance/current-projects/class-allocation-project) team intend to roll out a new timetabling experience ~~in semester 2 2022 or 2023~~ eventually. Once this transition is complete this project will be archived or rewritten as the Python scraper will be obsolete.
  * See [Web Publisher](https://www.anu.edu.au/students/program-administration/timetabling/01-access-and-support-for-mytimetable)

**Contributing:**

* If you would like to contribute bug reports or to the development, please join the [CSSA Discord server](https://cssa.club/discord) and chat with us in the #timetable channel

<!-- markdownlint-disable-file line-length -->
