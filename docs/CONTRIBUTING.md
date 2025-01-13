# Contributing to Trip Track

I love your input! I want to make contributing to Trip Track as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

I use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable.
2. For API Changes:
   - Update the API documentation using Swagger annotations
   - Follow the templates in docs/SWAGGER_TEMPLATE.md
   - Document all request/response schemas
   - Include authentication requirements
   - Add examples for new endpoints
   - Update docs/ARCHITECTURE.md if the changes affect system architecture
3. The PR will be merged once you have the sign-off of two other developers.

## API Documentation Standards

When documenting API changes:

1. **Use Swagger Annotations**

   - Follow the templates in [Swagger Template](SWAGGER_TEMPLATE.md)
   - Include clear summaries and descriptions
   - Document all parameters and response types
   - Add meaningful examples

2. **Schema Documentation**

   - Document all properties
   - Mark required fields
   - Include validation rules
   - Document relationships with other schemas

3. **Testing Documentation**
   - Verify documentation accuracy
   - Test example requests/responses
   - Ensure security requirements are clear
   - Check OpenAPI specification validity

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](../LICENSE) that covers the project. Feel free to contact me if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/babaygt/trip-track-social/issues)

I use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/babaygt/trip-track-social/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use interfaces over types where possible
- Document complex types

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Document component props
- Follow the feature-based folder structure

### API Development

- Follow RESTful principles
- Document all endpoints with Swagger
- Include proper error handling
- Add appropriate tests
- Follow the service pattern

### Testing

- Write meaningful test descriptions
- Test both success and error cases
- Mock external dependencies
- Keep tests focused and isolated

## License

By contributing, you agree that your contributions will be licensed under its [MIT License](../LICENSE).
