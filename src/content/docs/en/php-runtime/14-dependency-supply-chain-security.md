---
title: 14. Dependency and supply-chain security
description: Composer audit, policies, platform checks, lock files, plugins, scripts, and CI verification.
sidebar:
  order: 14
---

## Before you start

Read this lesson in three passes: understand the problem, follow the example, then try the final check yourself. The terms below are explained before they are used in detail.

### New terms in this lesson

- **CLI:** A text-based interface controlled by typed commands.


## The lock file is a build contract

Commit `composer.lock` for applications and use `composer install` in CI and production. `update` selects new versions and belongs in a reviewed, tested change—not deployment.

## Audit and platform checks

```bash
composer validate --strict
composer audit --locked
composer check-platform-reqs
composer outdated --direct
```

Do not ignore an advisory without a documented reason, expiry, and reachability review.

## Plugins and scripts

Composer plugins and scripts execute code with the Composer process permissions. Review and allow-list them:

```json
{
  "config": {
    "allow-plugins": {
      "trusted/package": true,
      "*": false
    }
  }
}
```

Do not run Composer as root on untrusted packages. `--no-plugins --no-scripts` reduces execution but may also disable required build steps.

## Policy and incident response

Use deliberate SemVer constraints, test supported ranges for libraries, review transitive dependencies, update regularly, and remove unused packages. Protect CI tokens and logs and record which artifact was built from which commit.

For a vulnerability, assess reachability, patch or mitigate, run the suite, deploy, and monitor. If a package or script exposed a secret, rotate it; uninstalling the package does not revoke the secret.

## References

- [Composer CLI: audit](https://getcomposer.org/doc/03-cli.md#audit)
- [Composer plugins and scripts safety](https://getcomposer.org/doc/faqs/how-to-install-untrusted-packages-safely.md)

## Operational problem

<details><summary>What should follow a dependency advisory?</summary><p>Confirm affected versions and reachable usage, update and test, and apply mitigation rather than ignoring or blindly upgrading.</p></details>

## Run and verify

Use the [downloadable lab](/en/php/00-lab-setup/) for supplied scripts. Commands for Composer, FPM, Docker, or a real server run inside the corresponding configured project, not an empty folder.

Execute this checkpoint inside the lesson environment:

~~~bash
composer audit --locked
~~~

**Success criterion:** The current lock has no unaccepted known vulnerability; every exception has an owner, reason, and expiry date.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Add an SBOM, provenance, and artifact signing, and inspect typosquatting plus maintainer changes rather than CVEs alone. Secret scanning keeps tokens out of source and history. Use VEX or equivalent exploitability records, with an owner, reason, and expiry for every exception.

### Try it yourself

Trace one package from commit to artifact and deployment and prove its provenance.
