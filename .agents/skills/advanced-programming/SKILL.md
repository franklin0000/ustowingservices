---
name: advanced-programming
description: Use this skill when generating clean, modular, scalable code, solving complex programming problems, optimizing algorithms, and following best practices across backend and frontend domains.
---

# Advanced Programming Skill

This skill instructs the agent to operate at the highest level of software engineering rigor when developing, refactoring, or optimizing code. 

## When to use this skill

- Generating new features or full applications across any development domain (backend, frontend, systems).
- Refactoring existing codebases for modularity, maintainability, and scalability.
- Solving complex algorithmic problems that require high efficiency and optimal time/space complexity.
- Writing production-ready, highly documented, and tested code.

## How to use it

When this skill is active, you MUST adhere to the following best practices and conventions:

### 1. Code Quality & Modularity
- **Clean Code:** Write self-documenting code with meaningful variable, function, and class names. Avoid magic numbers and hardcoded strings.
- **SOLID Principles:** Ensure classes and functions have a single responsibility. Favor composition over inheritance. 
- **Scalability:** Design interfaces and architectures that allow for future expansion without modifying existing core logic (Open/Closed Principle).

### 2. Algorithm Optimization
- Always evaluate the time and space complexity (Big-O) of your solutions before writing them.
- Choose the most efficient data structures for the problem at hand (e.g., Hash Maps for O(1) lookups, Heaps for priority queues).
- If multiple approaches exist, briefly document the trade-offs and implement the optimal one.

### 3. Cross-Domain Best Practices
- **Frontend:** Emphasize responsive design, accessibility (a11y), state management efficiency, and component reusability. Ensure modern frameworks (React, Vue, Next.js, etc.) follow their specific best practices.
- **Backend:** Focus on API design (RESTful or GraphQL), robust error handling, secure database queries, and stateless architecture where applicable.
- **Security:** Always sanitize inputs, use parameterized queries, and follow OWASP top 10 guidelines.

### 4. Documentation & Testing
- Include comprehensive docstrings or comments for all public APIs, functions, and classes explaining *why* something is done, not just *what*.
- Provide unit tests covering both happy paths and edge cases to guarantee reliability.

## Execution Workflow

1. **Understand:** Read the problem statement thoroughly. If requirements are vague or underspecified, clarify them.
2. **Design:** Briefly outline the architecture, data structures, or algorithm before writing the code.
3. **Implement:** Write the code strictly following the principles outlined above.
4. **Review & Refine:** Perform a self-review of the code to catch potential edge cases, performance bottlenecks, or style issues before presenting it to the user.
