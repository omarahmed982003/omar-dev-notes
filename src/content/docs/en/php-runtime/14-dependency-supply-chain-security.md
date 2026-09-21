---
title: 14. Dependency and supply-chain security
description: Composer audit, policies, platform checks, lock files, plugins, scripts, and CI verification.
sidebar:
  order: 14
---

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

