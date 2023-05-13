## Security

Thanks for helping make MillieJS safe for everyone.

By using MillieJS, you agree to adhere to this security policy. The MillieJS maintainers and contributors reserve the right to update this policy as necessary.

We take the security of this library seriously, including all of the open source MillieJS extensions and adapters managed by other parties. Even though open source MillieJS extensions and adapters are outside of the scope of this Security Policy, we will ensure that your finding gets passed along to the appropriate maintainers for remediation.

## Reporting Security Issues

If you believe you have found a security vulnerability in this repository, please report it to us through coordinated disclosure.

**Please do not report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

Instead, please use this repository's _Security Advisory_ feature, provided by GitHub. More information can be found at:
https://docs.github.com/en/code-security/security-advisories/repository-security-advisories/creating-a-repository-security-advisory.

Please include as much of the information listed below as you can to help us better understand and resolve the issue:

- The type of issue (e.g., buffer overflow, SQL injection, or cross-site scripting)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

## Policy

### Data Handling

MillieJS is a middleware layer that operates between other systems, and thus does not store data directly. Instead, it handles data passed through it, from interfaces on either end of the middleware. It is important to note that MillieJS may have access to stores managed by these other systems, but it does not perform the storage itself.

### Access Control

Access to MillieJS and its stored data is controlled by the consumer's infrastructure and is not managed by MillieJS maintainers or contributors. MillieJS is an open-source library that consumers will integrate into their own applications, meaning the maintainers and contributors do not have access to the data handled by MillieJS.

### Security Measures

The MillieJS codebase includes several automatic mechanisms for auditing the project's internal code for vulnerabilities. Examples include the utilization of public vulnerability databases to find any vulnerable dependencies, and taking steps to update those dependencies to vulnerability-free versions automatically.

### Vulnerability Reporting

If a vulnerability or security incident is discovered within the MillieJS codebase, we encourage users to report it privately through Github's Security Advisories feature. We will work to resolve any security issues in a timely and responsible manner.

### Compliance Requirements

As MillieJS is currently in pre-production, there are no specific compliance requirements that the project must meet at this time. However, interested parties are welcome to make requests for specific compliance requirements through the project's feature request process.

In the future, as MillieJS approaches production readiness, we will consider relevant compliance requirements to ensure the security and privacy of the project's users. We will work to meet any necessary requirements and communicate any updates to the security policy as they are made.
