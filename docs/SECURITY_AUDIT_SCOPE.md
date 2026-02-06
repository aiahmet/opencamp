# OpenCamp Security Audit Scope

**Date**: 2026-02-05
**Version**: 1.0
**Status**: Ready for External Penetration Test

---

## Executive Summary

OpenCamp is a self-hosted programming education platform that executes untrusted user code in isolated Docker containers. This document defines the scope for security penetration testing as required by ROADMAP Week 1.

---

## System Architecture Overview

### Components

1. **Web Application** (Next.js 16 + React 19)
   - Hosted on Vercel (production) / localhost (development)
   - Authentication: Clerk (OAuth, email/password)
   - Backend: Convex (serverless database)

2. **Code Execution Runner** (Node.js + Docker)
   - Express.js API server (port 4001)
   - Docker containerized execution environments
   - Languages: Java, Python, Go

3. **Database** (Convex)
   - Serverless document database
   - Real-time subscriptions

### Architecture Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────┐
│  Next.js App (Vercel)               │
│  - Clerk Authentication             │
│  - Convex Backend Integration       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Convex Database                    │
│  - User data                        │
│  - Curriculum content               │
│  - Progress tracking                │
└─────────────────────────────────────┘

┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP
       ▼
┌─────────────────────────────────────┐
│  Runner API (Express.js)            │
│  POST /run/java                     │
│  POST /run/python                   │
│  POST /run/go                       │
└──────────────┬──────────────────────┘
               │ docker run
               ▼
┌─────────────────────────────────────┐
│  Docker Container                   │
│  - Isolated network (--network=none) │
│  - Resource limits                  │
│  - Seccomp profile                  │
│  - Read-only filesystem             │
└─────────────────────────────────────┘
```

---

## In-Scope Items

### 1. Code Execution Sandbox (PRIMARY FOCUS)

#### Docker Security Configuration
- **Seccomp profiles**: `runner/seccomp/*.json`
  - Java: `java-profile.json`
  - Python: `python-profile.json`
  - Go: `go-profile.json`
- **Resource limits**: CPU, memory, disk, PIDs, timeout
- **Network isolation**: `--network=none`
- **Container hardening**: read-only root, dropped capabilities, non-root user

#### Runner API Endpoints
```
POST /run/java
POST /run/java-project
POST /run/python
POST /run/python-project
POST /run/go
POST /run/go-project
GET /health
POST /health
```

#### Attack Surface Analysis
- **Input validation**: Zod schemas
- **Code injection**: User-provided code execution
- **Container escape**: Docker daemon, kernel exploits
- **Resource exhaustion**: CPU, memory, disk, process limits
- **Side-channel attacks**: Shared resources, timing attacks

### 2. Web Application Security

#### Authentication & Authorization
- Clerk authentication flows
- Route protection via `proxy.ts`
- Session management
- User data access controls

#### API Security
- Convex query/mutation validation
- Rate limiting (if implemented)
- CSRF protection
- XSS prevention

#### Data Protection
- User PII handling
- Progress tracking data
- Discussion forums

### 3. Infrastructure Security

#### Dependencies
- npm packages (main app + runner)
- Docker base images
- Third-party services (Clerk, Convex, Vercel)

#### Secrets Management
- Environment variables
- Convex deployment secrets
- Clerk API keys

---

## Out-of-Scope Items

- Physical security of hosting providers
- Social engineering attacks
- Third-party service vulnerabilities (Clerk, Convex, Vercel)
- Browser vulnerabilities outside our control
- DNS/CDN attacks
- Network-level DDoS mitigation (handled by Vercel/Cloudflare)

---

## Test Cases for Auditors

### HIGH PRIORITY: Container Escape

1. **Container Escape via Docker Daemon**
   - Attempt to break out of container using known Docker vulnerabilities
   - Test for privileged container escalation
   - Verify no access to Docker socket

2. **Kernel Exploits**
   - Test for known container escape vulnerabilities (CVE-2019-5736, etc.)
   - Verify kernel version and patches

3. **Resource Exhaustion → Escape**
   - Attempt to exhaust container resources to trigger host access
   - Fork bombs, memory exhaustion, disk filling

### HIGH PRIORITY: Network Bypass

4. **Network Isolation Bypass**
   - Attempt to access external network from container
   - Test DNS resolution
   - Attempt to communicate with other containers
   - Attempt to access host services

### HIGH PRIORITY: Resource Exhaustion

5. **CPU/Memory Exhaustion**
   - Infinite loops consuming CPU
   - Memory allocation attacks
   - Verify limits are enforced

6. **Disk Space Exhaustion**
   - Write large files to /tmp
   - Verify disk limits are enforced

7. **Process Limit Bypass**
   - Fork bomb attempts
   - Verify PIDs limit is enforced

### MEDIUM PRIORITY: Code Injection

8. **Test Suite Injection**
   - Malicious test case input
   - Attempt to inject code via test parameters

9. **File Path Traversal**
   - Attempt to read/write files outside workspace
   - Test with `../../../etc/passwd` patterns

### MEDIUM PRIORITY: Side-Channel Attacks

10. **Timing Attacks**
    - Extract secrets via execution time differences
    - Cache timing attacks

11. **Shared Resource Attacks**
    - Access data from previous executions
    - Shared memory/CPU cache attacks

### LOW PRIORITY: DoS

12. **Slowloris Attacks**
    - Slow HTTP POST requests
    - Connection exhaustion

13. **Request Flooding**
    - Rapid successive code execution requests
    - Verify rate limiting (if implemented)

---

## Success Criteria

### Critical Vulnerabilities
- Zero (0) critical vulnerabilities allowed
- Zero (0) high-severity vulnerabilities allowed

### Container Isolation
- [ ] No container escape possible
- [ ] Network isolation enforced
- [ ] Resource limits enforced
- [ ] No access to host system

### Code Execution
- [ ] User code cannot access external network
- [ ] User code cannot access host filesystem
- [ ] User code cannot interfere with other executions
- [ ] Execution timeout is enforced

### Web Application
- [ ] Authentication properly enforced
- [ ] Protected routes inaccessible without auth
- [ ] No XSS vulnerabilities
- [ ] No SQL injection (Convex queries)
- [ ] Proper CSRF protection

---

## Testing Methodology

### Automated Testing
```bash
# 1. Dependency vulnerability scanning
npm audit
trivy fs .

# 2. Container image scanning
docker scan eclipse-temurin:21-jdk
docker scan python:3.12-alpine
docker scan golang:1.21-alpine

# 3. Static code analysis
eslint . --ext .ts,.tsx
semgrep --config=auto .
```

### Manual Testing
1. Black-box penetration testing
2. Code review of security-sensitive functions
3. Threat modeling review
4. Misconfiguration testing

### Tools Recommended
- **Burp Suite**: Web application security testing
- **Docker Bench**: Container security checks
- **Lynis**: Security auditing
- **Nikto**: Web server scanning
- **Metasploit**: Exploit testing

---

## Reporting Format

Please structure your report as follows:

1. **Executive Summary**
   - Overall risk assessment
   - Critical findings
   - Recommendations

2. **Detailed Findings**
   - Vulnerability ID
   - Severity (Critical/High/Medium/Low)
   - Description
   - Proof of Concept
   - Impact
   - Remediation steps

3. **Testing Methodology**
   - Tools used
   - Test coverage
   - Limitations

4. **Compliance & Best Practices**
   - OWASP Top 10 compliance
   - Container security best practices
   - Recommendations

---

## Contact Information

**Security Team**: [To be assigned]
**Audit Coordination**: [To be assigned]
**Timeline**: Week 1, Day 6-7 (per ROADMAP)
**Budget**: $800 allocated for external audit

---

## Appendix A: Docker Security Profile Examples

### Java Container Command
```bash
docker run --rm \
  --network none \
  --cpus=0.5 \
  --memory=256m \
  --memory-swap=256m \
  --pids-limit=256 \
  --security-opt=no-new-privileges \
  --security-opt=seccomp:runner/seccomp/java-profile.json \
  --cap-drop=ALL \
  --read-only \
  --user 1000:1000 \
  eclipse-temurin:21-jdk \
  sh -c "javac Solution.java && java Solution"
```

### Security Checklist
- [x] Seccomp profile applied
- [x] Network namespace (no egress)
- [x] cgroups limits (CPU, memory, PIDs)
- [x] Read-only root filesystem
- [x] Non-root user (1000:1000)
- [x] No privileged containers
- [x] All capabilities dropped
- [x] No new privileges flag

---

**Document Version**: 1.0
**Last Updated**: 2026-02-05
**Status**: Ready for External Penetration Test
