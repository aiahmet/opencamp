# OpenCamp ROADMAP Implementation Checklist

**Status**: Active implementation as of 2026-02-05
**Goal**: Implement ROADMAP.md v5.0 - Production-ready self-hosted programming education platform

---

## Executive Summary

Based on codebase analysis:
- **Tech Foundation**: ~70% complete (Next.js 16, React 19, Convex, Clerk, Docker runners)
- **Content**: ~5% complete (~12 Java lessons out of 35+ needed)
- **Security**: ~50% complete (basic Docker limits, missing seccomp/cgroups v2 hardening)
- **Features**: ~30% complete (missing Go support, Pro tier, payments)

---

## Priority Implementation Order

### Phase 1: Security & Infrastructure Foundation (Week 1 Requirements)

#### 1.1 Security Hardening
- [ ] **Seccomp Profiles**: Create and apply seccomp profiles for all Docker containers
- [ ] **cgroups v2 Verification**: Ensure CPU 2 cores, Memory 512MB, Disk 100MB, Network none
- [ ] **Security Audit Setup**: Prepare scope for external penetration test
- [ ] **Read-only Root Filesystem**: Verify all containers use read-only root
- [ ] **Network Isolation**: Confirm zero egress from sandboxes
- [ ] **Timeout Hard Limits**: Verify 30 second hard limit
- [ ] **Non-root User Execution**: Confirm all containers run as non-root
- [ ] **No Privileged Containers**: Audit and document no privileged containers
- [ ] **Security Checklist Document**: Create `/docs/SECURITY_CHECKLIST.md`

#### 1.2 Go Language Support (ROADMAP Month 2, but foundation needed)
- [ ] **Go Runner Implementation**: Create `runner/src/goExecutor.ts`
  - Docker image with Go installation
  - `go test` integration
  - Security patterns matching Java runner
- [ ] **Go Language Seed**: Add Go language to `convex/seed.ts`
- [ ] **Go Curriculum**: 10 Go lessons (ROADMAP requirement)

#### 1.3 CI/CD & Quality Infrastructure
- [ ] **GitHub Actions CI**: Pipeline for lint, test, build
- [ ] **Security Scanning**: Snyk/Trivy integration
- [ ] **Accessibility Testing**: axe-core automated checks

---

### Phase 2: Content Creation (ROADMAP Month 1-3)

#### 2.1 Java Curriculum (25 lessons total for v1.0)
- [ ] Module 1: Getting Started (4 lessons) - PARTIAL
- [ ] Module 2: Variables & Types (5 lessons)
- [ ] Module 3: Operators (4 lessons)
- [ ] Module 4: Control Flow (5 lessons)
- [ ] Module 5: Arrays & Strings (6 lessons)
- [ ] Module 6: Review & Practice (checkpoint)
- [ ] Module 7-12: OOP Fundamentals (12 lessons)
- [ ] Module 13-18: Collections (6 modules)
- [ ] Module 19-25: Advanced Java (7 modules)

#### 2.2 Go Curriculum (10 lessons for v1.0)
- [ ] Go Fundamentals 1-4: Setup, Variables, Types, Control
- [ ] Go Fundamentals 5-7: Functions, Error Handling, Structs
- [ ] Go Fundamentals 8-10: Interfaces, Concurrency, Testing

#### 2.3 Challenges & Projects
- [ ] 25 challenges with test suites
- [ ] 6 portfolio-worthy projects
- [ ] Debug exercises with 3-tier hints

---

### Phase 3: Pro Tier Features (ROADMAP Month 3)

#### 3.1 Progress Tracking
- [ ] User progress schema (Convex)
- [ ] Completion percentage tracking
- [ ] Module/lesson completion states
- [ ] Mastery checkpoint system

#### 3.2 Certificates
- [ ] Certificate generation system
- [ ] PDF certificate templates
- [ ] Certificate validation URLs
- [ ] Wallet/certificate sharing

#### 3.3 Advanced Challenges
- [ ] Algorithmic challenges
- [ ] System design challenges
- [ ] Leaderboard (opt-in)

#### 3.4 Offline Content
- [ ] Content export functionality
- [ ] Downloadable PDF/EPUB
- [ ] Offline code examples

---

### Phase 4: Business Features (ROADMAP Month 3)

#### 4.1 Payment Integration
- [ ] **Stripe Setup**: API keys, webhooks
- [ ] **Subscription Management**: Pro tier ($9/mo), Team tier ($49/mo)
- [ ] **Checkout Flow**: `/pricing` → Stripe → success/failure
- [ ] **Webhook Handlers**: subscription.created, updated, deleted
- [ ] **Entitlement System**: Check Pro status for features
- [ ] **Invoice Management**: Access to billing history

#### 4.2 Pricing Page
- [ ] `/pricing` route with tiers
- [ ] Feature comparison table
- [ ] Annual vs monthly toggle
- [ ] FAQ section

---

### Phase 5: Community & Growth (ROADMAP Month 4)

#### 5.1 Community Features
- [ ] **Contributor Guide**: `/CONTRIBUTING.md`
- [ ] **Issue Templates**: GitHub issue templates
- [ ] **PR Templates**: Pull request templates
- [ ] **Content Review Board**: Maintainer workflow
- [ ] **Quality Checks**: Automated validation

#### 5.2 Analytics
- [ ] **Completion Tracking**: Funnel analysis
- [ ] **Drop-off Detection**: Where users leave
- [ ] **Session Time**: Time spent per lesson
- [ ] **Dashboard**: Admin analytics view

---

### Phase 6: Testing & Documentation

#### 6.1 Test Suite
- [ ] **Unit Tests**: 70% coverage target
- [ ] **Integration Tests**: API endpoints
- [ ] **E2E Tests**: Critical user flows
- [ ] **Security Tests**: Penetration test automation

#### 6.2 Documentation
- [ ] **API Docs**: OpenAPI/Swagger
- [ ] **Admin Guide**: Deployment & operations
- [ ] **Contributor Guide v1.0**: For community
- [ ] **User Documentation**: Help content
- [ ] **Migration Guide**: For upgrades

---

## Quick Start Actions (Next Steps)

1. **Immediate (Day 1-2)**:
   - Create seccomp profiles
   - Verify cgroups v2 limits
   - Create security checklist document

2. **Short-term (Week 1)**:
   - Implement Go runner
   - Create GitHub Actions CI
   - Add security scanning

3. **Medium-term (Month 1)**:
   - Complete Java curriculum to 12 lessons
   - Implement Pro tier schema
   - Start Go curriculum

4. **Long-term (Months 2-4)**:
   - Full 35 lessons (25 Java + 10 Go)
   - Payment integration
   - Community features

---

## Security Audit Preparation

### Pre-Audit Checklist
- [ ] Seccomp profiles applied to all containers
- [ ] Network namespace enforced (no egress)
- [ ] cgroups v2 limits verified
- [ ] Read-only root filesystem
- [ ] Non-root user execution
- [ ] No privileged containers
- [ ] Container image scanning (Trivy)
- [ ] Dependency vulnerability scanning (Snyk)
- [ ] Secrets not in code
- [ ] Rate limiting on API endpoints

### Audit Scope Document
Create `/docs/SECURITY_AUDIT_SCOPE.md` with:
1. System architecture diagram
2. Threat model
3. Attack surface analysis
4. Test cases for auditors
5. Success criteria

---

## Notes

### Language Discrepancy
- **ROADMAP.md** specifies: Java → Go → Rust
- **Current implementation** has: Java + Python runners
- **Decision**: Implement Go as per ROADMAP, keep Python for future expansion

### Content Velocity
- CURRICULUM_TODO.md has 120+ lessons (full bootcamp)
- ROADMAP specifies 35 lessons for v1.0
- **Approach**: Implement ROADMAP 35 first, then expand to full curriculum

### Testing Gap
- Test infrastructure exists (Vitest + RTL)
- Zero tests written currently
- **Priority**: Write tests alongside new features

---

**Last Updated**: 2026-02-05
**Next Review**: After Phase 1 completion
