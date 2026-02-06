# OpenCamp 4-Month Roadmap v5.0

**Focus:** Self-hosted programming education platform  
**Stack:** Java → Go → Rust (phased)  
**Team:** 2-3 contributors  
**Philosophy:** Security-first, sustainable, ship every 2 weeks  
**Status:** ✅ Version 5.0 - Production-Ready Plan

---

## Executive Summary

This roadmap delivers a **production-grade, self-hosted programming education platform** over 4 months with 2-3 contributors. The timeline accounts for realistic content velocity, comprehensive security auditing, and sustainable business model from Day 1.

### Key Decisions
- **Reduced scope:** 35 lessons (Java 25 + Go 10) for v1.0 instead of 50 with Rust
- **Revenue Day 1:** Pro tier launching with v1.0
- **Community-first:** Open contribution model from Month 2
- **Security 3x:** Pen-tests at Weeks 1, 8, and 16

---

## Timeline Overview

| Phase | Duration | Deliverable | Lessons | Users | Revenue |
|-------|----------|-------------|---------|-------|---------|
| **Foundation** | Month 1 | Java MVP | 12 | 15 beta | $0 |
| **Scale** | Month 2 | Go support + Open Source | 25 | 75 beta | $0 |
| **Launch** | Month 3 | v1.0 + Pro tier | 35 | 200+ | $500/mo |
| **Grow** | Month 4 | Community contributions | 35+ | 500+ | $1.5K/mo |

---

## Month 1: Foundation (Weeks 1-4)

**Goal:** Secure, deployable Java MVP with 12 lessons.

**Team Focus:** Technical Lead (100%), Content Lead (ramp-up Weeks 1-2, 100% Weeks 3-4)

### Week 1: Security-First Foundation (Days 1-7)

| Day | Task | Owner | Deliverable | Gate |
|-----|------|-------|-------------|------|
| 1 | Architecture finalization, threat modeling | Tech | Security architecture doc | Review |
| 2-3 | Docker + CI/CD setup with security scanning | Tech | `docker-compose up` + CI green | Deploy |
| 4-5 | Seccomp profiles, cgroups v2, network isolation | Tech | Sandbox passes security checklist | Security |
| 6-7 | **Security Audit #1:** External pen-test begins | Tech | Audit scope defined, tester hired | Security |
| 8-9 | **Buffer:** Address Week 1 findings, hardening | Tech | All critical issues resolved | Security |

**Security Requirements (Week 1 Hard Gates):**
- ✅ Seccomp profiles for all containers
- ✅ Network isolation (zero egress from sandboxes)
- ✅ cgroups v2: CPU 2 cores, Memory 512MB, Disk 100MB, Network none
- ✅ Timeout: 30 seconds hard limit
- ✅ No privileged containers, read-only root filesystem
- ✅ Security audit **PASSED** before any user code execution

### Week 2: Core Platform (Days 10-16)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 10-12 | Markdown curriculum system + CLI tools | Tech | `opencamp create`, `validate`, `preview` |
| 13-14 | Content Lead onboarding, template training | Both | Content Lead productive |
| 15-16 | Java runner: JUnit 5, test framework, output capture | Tech | HelloWorld → "PASS" |

**Lesson Standards:**
- Format: YAML frontmatter + Markdown + test files
- Structure: 2-3 learning objectives, 3-5 exercises, 5-12 min duration
- WCAG 2.1 AA: keyboard navigable, screen reader compatible, 4.5:1 contrast
- Mobile-first responsive (min 320px width)
- Prerequisite mapping (DAG structure)

### Week 3: Content Sprint (Days 17-23)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 17-19 | Lessons 1-4: Variables, Types, Operators, Control Flow | Content | 4 lessons, peer-reviewed |
| 20-21 | Lessons 5-6: Loops, Arrays | Content | 6 lessons total |
| 22-23 | Challenges 1-6 (syntax + algorithmic) | Content | 6 challenges with tests |
| 17-23 | Frontend polish, accessibility audit | Tech | WCAG 2.1 AA compliance |

**Buffer Days:** 24-25 (accessibility fixes, edge cases)

### Week 4: Beta Prep + OOP (Days 24-30)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 24-26 | Lessons 7-9: Methods, Overloading, Scope | Content | 9 lessons |
| 26-27 | **Security Audit #1 Results:** Address all findings | Tech | Pen-test report: 0 critical, 0 high |
| 27-28 | Lessons 10-12: I/O, Objects intro, Classes | Content | 12 lessons |
| 28-29 | Beta tester recruitment: 15 students/educators | Both | 15 testers confirmed, onboarded |
| 29-30 | Beta platform: feedback forms, analytics, Discord | Tech | Beta infrastructure live |

**Week 5: Bug Fix Sprint + Security Hardening (Days 31-37)**
- Fix top 10 beta issues
- Security hardening from audit feedback
- Target: >75% completion rate on fundamentals track

---

## Month 2: Scale + Open Source (Weeks 6-9)

**Goal:** 25 total lessons, 75 beta testers, open source launch.

### Week 6: Go Infrastructure (Days 38-44)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 38-40 | Fix Month 1 critical bugs | Tech | Zero P0/P1 issues |
| 41-44 | Go runner: Docker, `go test`, security patterns | Tech | Go code executes safely |
| 42-44 | Lessons 13-15: Java OOP (Inheritance, super, Composition) | Content | 15 lessons total |

### Week 7: Go Content + Templates (Days 45-51)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 45-47 | Go Fundamentals 1-4: Setup, Variables, Types, Control | Content | 4 Go lessons |
| 47-48 | Content templates + automated review pipeline | Tech | Content PRs auto-validated |
| 49-51 | Lessons 16-18: Java (Modifiers, Inner Classes, Packages) | Content | 18 lessons |
| 49-51 | Challenges 7-15 (5 Java, 3 Go, 5 mixed) | Content | 15 challenges |

### Week 8: Community + Analytics (Days 52-58)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 52-54 | GitHub public, contributor guide, issue templates | Both | Repo public, 5+ stars |
| 54-55 | Beta expansion: 60 more testers (total 75) | Both | 75 active testers |
| 55-56 | Analytics: completion rates, drop-offs, session time | Tech | Dashboard operational |
| 57-58 | Lessons 19-20: Go (Functions, Error Handling) | Content | 20 lessons |

**Security Audit #2:** Days 55-58 (external pen-test, bounty program setup)

### Week 9: Polish + Templates (Days 59-65)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 59-61 | **Security Audit #2:** Address findings, hardening | Tech | 0 critical vulnerabilities |
| 61-63 | Performance: <1.5s page load, <300ms API | Tech | Lighthouse 90+ performance |
| 63-65 | Lessons 21-22: Go (Structs, Interfaces) | Content | 22 lessons |
| 63-65 | First community contribution merged | Community | External PR merged |

---

## Month 3: Launch + Pro Tier (Weeks 10-13)

**Goal:** v1.0 with 35 lessons, Pro tier, 200+ users.

### Week 10: Pro Tier Development (Days 66-72)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 66-68 | Pro tier: progress tracking, certificates, advanced challenges | Tech | Pro features implemented |
| 68-69 | Pricing: $9/mo individual, $49/mo team (10 users) | Both | Pricing finalized |
| 70-72 | Lessons 23-25: Java Collections framework | Content | 25 lessons |
| 70-72 | Challenges 16-25 (10 advanced) | Content | 25 challenges |

### Week 11: Payment + Documentation (Days 73-79)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 73-75 | Stripe integration, subscription management | Tech | Payment flow working |
| 75-77 | API docs, admin guide, contributor guide v1.0 | Both | All docs complete |
| 77-79 | Lessons 26-28: Go (Concurrency, Channels) | Content | 28 lessons |

### Week 12: Pre-Launch Hardening (Days 80-86)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 80-82 | **Security Audit #3:** Final pen-test + load testing | Tech | 100 concurrent users OK |
| 82-83 | Cross-browser testing, mobile optimization | Tech | 99%+ browser coverage |
| 83-84 | Lessons 29-30: Go (Testing, Standard Library) | Content | 30 lessons |
| 84-86 | Migration guide, release notes, changelog | Both | v1.0 ready |

### Week 13: v1.0 Launch (Days 87-93)

| Day | Task | Owner | Deliverable |
|-----|------|-------|-------------|
| 87-88 | v1.0 tag, deploy to production | Tech | Live at opencamp.io |
| 89-90 | Product Hunt, Hacker News, dev.to launch | Both | 500+ upvotes combined |
| 90-91 | Educator outreach: 10 universities contacted | Both | 3 pilot programs |
| 91-93 | Pro tier goes live, first 10 paid users | Both | $90 MRR |

---

## Month 4: Growth + Sustainability (Weeks 14-17)

**Goal:** Community-driven growth, Rust on roadmap, $1.5K MRR.

### Week 14-15: Community Contributions

- Open contribution workflow: 5 external lessons submitted
- Content review board: 3 maintainers
- Automated quality checks: grammar, accessibility, test validation
- Lessons 31-35 (community contributions)

### Week 16-17: Analytics + Expansion

- **Security Audit #4:** Quarterly review (ongoing)
- User feedback drives roadmap
- Rust support: Technical spike, community vote
- Target: 500+ users, $1.5K MRR, 40 lessons

---

## Success Metrics

### Content Metrics

| Phase | Lessons | Challenges | Test Coverage |
|-------|---------|------------|---------------|
| Month 1 | 12 | 6 | 75% |
| Month 2 | 22 | 15 | 80% |
| Month 3 | 35 | 25 | 85% |
| Month 4 | 40+ | 30+ | 85%+ |

### Business Metrics

| Phase | Users | Free | Pro | MRR | CAC | LTV |
|-------|-------|------|-----|-----|-----|-----|
| Month 1 | 15 | 15 | 0 | $0 | - | - |
| Month 2 | 75 | 75 | 0 | $0 | - | - |
| Month 3 | 200+ | 180 | 20 | $180 | $5 | $108 |
| Month 4 | 500+ | 425 | 75 | $675 | $3 | $162 |

### Technical Gates

- **Security:** 0 critical/high vulnerabilities (continuous)
- **Deployment:** <10 min on fresh VM (verified monthly)
- **Performance:** <1.5s page load (Lighthouse 90+)
- **Accessibility:** >95 Lighthouse a11y, WCAG 2.1 AA
- **Test coverage:** >80% lines, >70% branches
- **Uptime:** 99.9% (self-hosted with monitoring)
- **Security audits:** 4 pen-tests (Weeks 1, 8, 12, 16)

### Content Quality Gates

- **Peer review:** 2 reviewers per lesson
- **Beta testing:** >70% completion rate before GA
- **Accessibility:** Automated axe-core + manual screen reader test
- **Accuracy:** All code samples tested in sandbox
- **Pedagogy:** SME review for learning objectives alignment

---

## Business Model: Sustainable from Day 1

### Revenue Streams

1. **Pro Tier ($9/mo individual)**
   - Progress tracking & certificates
   - Advanced challenges (algorithmic, system design)
   - Downloadable offline content
   - Priority support

2. **Team License ($49/mo, 10 users)**
   - Admin dashboard
   - Progress reports
   - Custom curriculum paths
   - SSO integration

3. **Self-Hosted Enterprise ($299/mo)**
   - On-premise deployment
   - Custom branding
   - SLA support
   - Advanced security features

### Cost Structure

| Item | Monthly |
|------|---------|
| Infrastructure (prod + staging) | $100-150 |
| Security audits (amortized) | $200 |
| Content creation (contractors) | $500 |
| Payment processing (Stripe 2.9%) | Variable |
| **Break-even:** | **~35 Pro users** |

### Open Source Sustainability

- Core platform: MIT License
- Content: CC BY-SA 4.0
- Pro features: Source-available, paid license
- Contributor compensation: $50/accepted lesson (from Month 4)

---

## Community Strategy

### Month 1: Closed Beta
- 15 hand-picked testers (students + educators)
- Direct Slack/Discord access to team
- Weekly feedback calls

### Month 2: Open Beta
- GitHub public
- Contributor guide
- Good first issues tagged
- Community Discord server

### Month 3: Launch
- Product Hunt, Hacker News
- Dev.to technical write-ups
- University pilot programs
- YouTube tutorial series

### Month 4+: Growth
- Contributor compensation program
- Content review board (elected community members)
- Monthly community calls
- Annual conference (virtual)

---

## Risk Matrix

| Risk | Likelihood | Impact | Mitigation | Status |
|------|------------|--------|------------|--------|
| Content velocity slower than expected | Medium | High | Reduced scope (35 lessons), community contributions Month 4, $50/lesson bounty | ✅ Mitigated |
| Security vulnerabilities in sandbox | Low | Critical | 4 pen-tests, bug bounty, seccomp + cgroups, no egress, 30s timeout | ✅ Mitigated |
| Low user engagement | Medium | High | Beta testing Month 1, data-driven features, educator pilots, free tier always available | ✅ Mitigated |
| Team member departure | Medium | High | Documentation-first, pair programming, 2-week sprints, open source community | ✅ Mitigated |
| Docker deployment complexity | Medium | Medium | 10-min deployment tested weekly, video guides, one-click DigitalOcean droplet | ✅ Mitigated |
| Accessibility compliance failures | Low | High | Automated testing Week 1, manual audit Week 8, WCAG 2.1 AA hard gate | ✅ Mitigated |
| Payment processing issues | Low | Medium | Stripe (proven), test mode, 30-day free trial, annual discount | ✅ Mitigated |
| Feature creep | Low | High | Data-driven roadmap, complex features post-v1.0, strict 2-week sprints | ✅ Mitigated |

---

## Quality Gates

### Weekly
- [ ] All tests passing (>80% coverage)
- [ ] Security scan clear (Snyk/Trivy)
- [ ] Accessibility checks (axe-core automated)
- [ ] Performance: <1.5s page load, <300ms API
- [ ] Content review: 2 reviewers sign-off
- [ ] Security: No new CVEs in dependencies

### Bi-Weekly (Sprint)
- [ ] Code review (all PRs, 1+ reviewer)
- [ ] Beta feedback top 5 issues addressed
- [ ] Documentation updated
- [ ] Deployment test on fresh VM (<10 min)
- [ ] Sandbox security checklist verified

### Monthly
- [ ] Stakeholder demo (recorded)
- [ ] 5+ user tests (unmoderated + moderated)
- [ ] Curriculum SME review
- [ ] **Security audit** (external pen-test)
- [ ] Accessibility WCAG 2.1 AA manual check
- [ ] Metrics review + roadmap adjustment
- [ ] Financial review (burn rate, MRR)

### Quarterly
- [ ] Full security re-architecture review
- [ ] Business model validation
- [ ] Team retrospective + planning
- [ ] Community health check
- [ ] Competitive analysis

---

## Resource Requirements

### Team (2.5 FTE)

| Role | Responsibility | FTE | Rate | Monthly |
|------|---------------|-----|------|---------|
| Technical Lead | Architecture, sandbox, DevOps, frontend, security | 1.0 | $8K/mo | $8,000 |
| Content Lead | Curriculum, challenges, QA, community | 1.0 | $6K/mo | $6,000 |
| Community/Testing | Docs, beta coordination, support, content review | 0.5 | $3K/mo | $1,500 |
| **Total** | | **2.5** | | **$15,500** |

**Contractors (as needed):**
- Security auditor: $800/audit × 4 = $3,200
- Accessibility consultant: $500/audit × 2 = $1,000
- Content reviewers: $50/lesson × 35 = $1,750

### Infrastructure

| Component | Specs | Monthly | Purpose |
|-----------|-------|---------|---------|
| Production | 4CPU, 8GB, 100GB SSD | $60-80 | Live users |
| Staging | 2CPU, 4GB, 50GB | $30-40 | Testing |
| Sandboxes (5×) | 2CPU, 1GB each | $50-70 | Code execution |
| Backups | 100GB | $10 | Data protection |
| Monitoring | Datadog/Render | $20-30 | Uptime, alerts |
| CDN | Cloudflare | $0-20 | Assets, DDoS |
| **Total** | | **$190-240** | |

### Tools & Services

| Service | Cost | Purpose |
|---------|------|---------|
| GitHub Pro | $21/mo | Private repos, actions |
| Stripe | 2.9% + $0.30 | Payments |
| Snyk | $0 (open source) | Security scanning |
| Figma | $15/mo | Design |
| Notion | $0 | Docs, planning |
| Discord | $0 | Community |
| **Total** | ~$50/mo + processing | |

### Total Monthly Burn: ~$16,000

**Break-even:** 35 Pro users @ $9/mo + 1 Team @ $49/mo = $364/mo covers infra/tools, team costs require external funding or delayed compensation until MRR grows.

**Funding Strategy:**
- Month 1-2: Founder savings / angel investment ($32K)
- Month 3+: Revenue + potential seed round
- Month 6+: Sustainable at 200 Pro users

---

## Content Moderation & Quality

### Pre-Publication (All Content)

1. **Automated Checks** (CI/CD)
   - YAML schema validation
   - Markdown linting
   - Code sample execution in sandbox
   - Accessibility: axe-core (0 violations)
   - Link checking
   - Spell/grammar check

2. **Peer Review** (2 reviewers)
   - Technical accuracy
   - Pedagogical soundness
   - Code style consistency
   - Difficulty calibration

3. **Beta Testing** (5+ users)
   - Completion rate >70%
   - Average rating >4/5
   - Time-on-task within 20% of target

### Post-Publication (Community Content)

1. **Report System**
   - Inaccurate content
   - Accessibility issues
   - Inappropriate material
   - Outdated information

2. **Review Queue**
   - Community flagging
   - Automated quality scoring
   - Maintainer review within 48hrs

3. **Content Lifecycle**
   - Quarterly accuracy audits
   - Annual curriculum review
   - Deprecation process for outdated content

---

## Contingency Plans

### Scenario A: Team Member Departs Month 2

**Impact:** 50% capacity reduction  
**Response:**
- Pause Go content, focus on Java completion (25 lessons)
- Hire contractor content creator ($3K, 4 weeks)
- Extend timeline by 2 weeks
- Reduce beta scope to 50 users

### Scenario B: Security Vulnerability Found

**Impact:** Deployment blocked  
**Response:**
- Day 1: Isolate sandbox, disable user code execution
- Day 2-3: Fix vulnerability, add regression test
- Day 4-5: Re-audit, deploy patch
- Day 6+: Resume with enhanced monitoring

### Scenario C: Low Beta Engagement (<50% completion)

**Impact:** Product-market fit concerns  
**Response:**
- Week 1: User interviews (10+ sessions)
- Week 2: Pivot options analysis (content type, difficulty, UX)
- Week 3: A/B test improvements
- Week 4: Decide on pivot vs. persevere

### Scenario D: Content Velocity 50% of Expected

**Impact:** 35 lessons not achievable  
**Response:**
- Reduce v1.0 scope to 25 high-quality lessons
- Launch with Java only, Go as v1.1 (Month 5)
- Increase contractor budget (+$2K)
- Community bounty program early (Month 3)

---

## Immediate Actions (This Week)

### Day 1-2: Team & Planning
- [ ] Confirm 2-3 contributors (signed agreements)
- [ ] Set up project management (GitHub Projects)
- [ ] Schedule Week 1 kickoff meeting
- [ ] Define communication norms (Slack/Discord, standups)

### Day 3-4: Technical Foundation
- [ ] Technical spike: Docker sandboxing (2 days)
- [ ] Security threat modeling session
- [ ] CI/CD pipeline scaffold
- [ ] Repo setup: Monorepo structure

### Day 5-7: Content & Community
- [ ] YAML schema v1.0 finalization
- [ ] Accessibility: Configure axe-core, pa11y
- [ ] Recruit 15 beta testers (students + educators)
- [ ] Create beta tester onboarding flow

### Week 1 Deliverables
- [ ] Security architecture document
- [ ] Docker compose working locally
- [ ] 3 validated lesson templates
- [ ] 15 beta testers confirmed
- [ ] Security audit scheduled (external)

---

## Post-v1.0 Roadmap (Months 5-12)

### Month 5-6: Expansion
- Rust support (community-driven)
- Mobile app (React Native)
- Advanced tracks (DSA, System Design)
- API for LMS integrations

### Month 7-9: Enterprise
- SAML/SSO
- SCIM provisioning
- Advanced analytics
- Custom deployments

### Month 10-12: Scale
- AI-assisted learning paths
- Peer code review system
- Live coding interviews
- Internationalization (ES, FR, DE)

---

## Appendix

### A. Content Template Structure

```yaml
---
id: java-variables-001
title: "Understanding Variables"
difficulty: beginner
duration: 8
prerequisites: []
learning_objectives:
  - Declare and initialize variables
  - Understand primitive types
  - Follow naming conventions
exercises:
  - id: ex1
    type: code
    description: "Declare an integer variable..."
    tests: [...]
accessibility:
  - Screen reader optimized
  - Keyboard navigable
  - High contrast mode
---

# Content here...
```

### B. Security Checklist

- [ ] Seccomp profile applied
- [ ] Network namespace (no egress)
- [ ] cgroups v2 limits enforced
- [ ] Read-only root filesystem
- [ ] Non-root user execution
- [ ] Resource limits (CPU, memory, disk, time)
- [ ] No privileged containers
- [ ] Container image scanning
- [ ] Dependency vulnerability scanning
- [ ] Secrets not in code

### C. Definition of Done

- [ ] Code reviewed and approved
- [ ] Tests passing (>80% coverage)
- [ ] Security scan clear
- [ ] Accessibility check passed
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Beta tested (if user-facing)
- [ ] Performance budget met

---

*Roadmap v5.0 - Production-Ready, Sustainable, Secure*  
*Last updated: 2026-02-05*  
*Next review: End of Week 1*