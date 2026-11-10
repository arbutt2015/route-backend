# Route backend

- Build: `npm run build`. Development server: `npm run start:dev` (port 5001 by default). Swagger: `/api/swagger`.
- Configuration uses AWS Secrets Manager and may target the same database/Cognito pool as manager2.0-backend. Do not run live profile/password mutations as verification; use the mocked tests.
- Profile verification: `npm run test:profile` runs Node unit and isolated HTTP tests using ts-node/tsconfig-paths. No database or AWS calls are made. The HTTP suite uses the real global guards and response interceptor with a test-only Passport strategy.
- `GET /api/users/me` and `PATCH /api/users/me` derive userId from the JWT principal. Only personal profile fields may be changed; email, roles, access flags, verification and identity fields must not be accepted.
- `PUT /api/auth/change-password` explicitly overrides the public AuthController metadata to require JWT authentication. Its DTO accepts only previousPassword/proposedPassword, and the password-change-required flag is updated using the authenticated user's ID.
- Logout matches the manager UI's local-session behavior; there is no backend logout endpoint or global Cognito sign-out in this flow.
