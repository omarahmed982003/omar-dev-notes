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
composer check-platform-reqs --lock --no-dev
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

## SBOM, provenance, and signing

Generate the SBOM from the final artifact, not only `composer.json`, because an image also contains operating-system packages, extensions, and files. Connect provenance to the commit, builder, workflow, and digest. A signature proves artifact origin and integrity; it does not prove absence of vulnerabilities.

The acceptance policy must identify who approves an exception, its expiry, whether affected code is reachable, and which environment runs the vulnerable digest. Test the path from CVE to lock file, image, and deployment.

## CI and secrets

Reduce default workflow permissions, pin third-party actions to a reviewed commit, and keep untrusted pull requests away from secrets. Scan history and rotate any exposed credential; deleting it from the latest commit does not revoke it.

~~~text
source commit -> locked dependencies -> SBOM -> signed image digest -> deployment record
~~~


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

Run this checkpoint inside `examples/php-labs` or the extracted lab package:

~~~bash
composer audit --locked
composer check-platform-reqs --lock --no-dev
~~~

**Success criterion:** The current lock has no unaccepted known vulnerability; every exception has an owner, reason, and expiry date.

Record the exit code and observed evidence. If reality differs, explain the environmental or design assumption that failed instead of editing the expectation to match a defect.

## Connect the ideas

Add an SBOM, provenance, and artifact signing, and inspect typosquatting plus maintainer changes rather than CVEs alone. Secret scanning keeps tokens out of source and history. Use VEX or equivalent exploitability records, with an owner, reason, and expiry for every exception.

#### Practice cycle

Write your prediction before running the example and record the output. Introduce one controlled failure, collect evidence from logs or metrics, repair the cause, and rerun the check to prove the fix handles the fault instead of hiding it.


### Try it yourself

Trace one package from commit to artifact and deployment and prove its provenance.
