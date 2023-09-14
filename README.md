# Event-Sidecar

[![Git Commit](https://img.shields.io/github/last-commit/mojaloop/event-sidecar.svg?style=flat)](https://github.com/mojaloop/event-sidecar/commits/main)
[![Git Releases](https://img.shields.io/github/release/mojaloop/event-sidecar.svg?style=flat)](https://github.com/mojaloop/event-sidecar/releases)
[![Docker pulls](https://img.shields.io/docker/pulls/mojaloop/event-sidecar.svg?style=flat)](https://hub.docker.com/r/mojaloop/event-sidecar)
[![CircleCI](https://circleci.com/gh/mojaloop/event-sidecar.svg?style=svg)](https://circleci.com/gh/mojaloop/event-sidecar)

Swagger api [src/interface/swagger.json](src/interface/swagger.json)

- The Event-Sidecar will publish events to a singular Kafka topic that will allow for multiple handlers to consume and process the events as required.
- Kafka partitions will be determined by the event-type (e.g. log, audit, trace, errors etc).
- Each Mojaloop component will have its own tightly coupled Sidecar.

## Auditing Dependencies

We use `npm-audit-resolver` along with `npm audit` to check dependencies for node vulnerabilities, and keep track of resolved dependencies with an `audit-resolve.json` file.

To start a new resolution process, run:

```bash
npm run audit:resolve
```

You can then check to see if the CI will pass based on the current dependencies with:

```bash
npm run audit:check
```

And commit the changed `audit-resolve.json` to ensure that CircleCI will build correctly.

## Container Scans

As part of our CI/CD process, we use anchore-cli to scan our built docker container for vulnerabilities upon release.

If you find your release builds are failing, refer to the [container scanning](https://github.com/mojaloop/ci-config#container-scanning) in our shared Mojaloop CI config repo. There is a good chance you simply need to update the `mojaloop-policy-generator.js` file and re-run the circleci workflow.

For more information on anchore and anchore-cli, refer to:

- [Anchore CLI](https://github.com/anchore/anchore-cli)
- [Circle Orb Registry](https://circleci.com/orbs/registry/orb/anchore/anchore-engine)

## Automated Releases

As part of our CI/CD process, we use a combination of CircleCI, standard-version
npm package and github-release CircleCI orb to automatically trigger our releases
and image builds. This process essentially mimics a manual tag and release.

On a merge to main, CircleCI is configured to use the mojaloopci github account
to push the latest generated CHANGELOG and package version number.

Once those changes are pushed, CircleCI will pull the updated main, tag and
push a release triggering another subsequent build that also publishes a docker image.

### Potential problems

- There is a case where the merge to main workflow will resolve successfully, triggering
  a release. Then that tagged release workflow subsequently failing due to the image scan,
  audit check, vulnerability check or other "live" checks.

  This will leave main without an associated published build. Fixes that require
  a new merge will essentially cause a skip in version number or require a clean up
  of the main branch to the commit before the CHANGELOG and bump.

  This may be resolved by relying solely on the previous checks of the
  merge to main workflow to assume that our tagged release is of sound quality.
  We are still mulling over this solution since catching bugs/vulnerabilities/etc earlier
  is a boon.

- It is unknown if a race condition might occur with multiple merges with main in
  quick succession, but this is a suspected edge case.
