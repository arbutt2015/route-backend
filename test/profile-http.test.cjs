const { test } = require("node:test");
const assert = require("node:assert/strict");
require("reflect-metadata");
const { Module } = require("@nestjs/common");
const { NestFactory, APP_GUARD, APP_INTERCEPTOR } = require("@nestjs/core");
const passport = require("passport");
const { AdmUserController } = require("../src/adm-user/adm-user.controller");
const { AdmUserService } = require("../src/adm-user/adm-user.service");
const { AuthController } = require("../src/auth/auth.controller");
const { AuthService } = require("../src/auth/auth.service");
const { JwtAuthGuard } = require("../src/auth/jwt-auth.guard");
const { RolesGuard } = require("../src/auth/role.guard");
const {
  ResponseInterceptor,
} = require("../src/interceptors/response.interceptor");
const { LoggerService } = require("../src/logger/logger.service");

class TestJwtStrategy extends passport.Strategy {
  constructor() {
    super();
    this.name = "jwt";
  }
  authenticate(req) {
    if (req.headers.authorization === "Bearer test-session")
      this.success({ userId: 7 });
    else this.fail({}, 401);
  }
}

test("profile HTTP routes enforce authentication, validation and self-only updates", async (t) => {
  passport.use(new TestJwtStrategy());
  const profile = {
    userId: 7,
    email: "amina@example.com",
    firstName: "Amina",
    middleInitial: "",
    lastName: "Example",
    companyName: "Example",
    title: "Engineer",
    phoneNumber: "0123456789",
    isPasswordChangeRequired: false,
    cognitoId: "private",
  };
  const persisted = [];
  const passwordCalls = [];
  const users = new AdmUserService(
    {
      getUser: async () => profile,
      updateUserByWhereAndGetData: async (filter, body) => {
        persisted.push({ filter, body });
        return [{ ...profile, ...body }];
      },
    },
    {},
  );
  class TestModule {}
  Module({
    controllers: [AdmUserController, AuthController],
    providers: [
      { provide: AdmUserService, useValue: users },
      {
        provide: AuthService,
        useValue: {
          changePassword: async (...args) => {
            passwordCalls.push(args);
            return {};
          },
        },
      },
      { provide: LoggerService, useValue: { error() {} } },
      { provide: APP_GUARD, useClass: JwtAuthGuard },
      { provide: APP_GUARD, useClass: RolesGuard },
      { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    ],
  })(TestModule);
  const app = await NestFactory.create(TestModule, { logger: false });
  t.after(async () => {
    await app.close();
    passport.unuse("jwt");
  });
  app.setGlobalPrefix("api");
  await app.listen(0, "127.0.0.1");
  const base = await app.getUrl();
  const send = (path, method = "GET", body, token = "test-session") =>
    fetch(`${base}/api/${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  assert.equal((await send("users/me", "GET", undefined, "")).status, 401);
  assert.equal(
    (await send("users/me", "GET", undefined, "invalid")).status,
    401,
  );
  const read = await send("users/me");
  assert.equal(read.status, 200);
  const readBody = await read.json();
  assert.equal(readBody.data.userId, 7);
  assert(!Object.hasOwn(readBody.data, "cognitoId"));
  const values = {
    firstName: "Updated",
    middleInitial: "",
    lastName: "Example",
    companyName: "Example",
    title: "",
    phoneNumber: "",
  };
  for (const extra of [
    { userId: 99 },
    { usersAccess: true },
    { email: "other@example.com" },
  ]) {
    assert.equal(
      (await send("users/me", "PATCH", { ...values, ...extra })).status,
      400,
    );
  }
  assert.equal(persisted.length, 0);
  const saved = await send("users/me", "PATCH", values);
  assert.equal(saved.status, 200);
  assert.equal((await saved.json()).data.firstName, "Updated");
  assert.deepEqual(persisted[0].filter, { where: { userId: 7 } });
  const password = {
    previousPassword: "OldPassword123!",
    proposedPassword: "NewPassword123!",
  };
  assert.equal(
    (await send("auth/change-password", "PUT", password, "")).status,
    401,
  );
  assert.equal(
    (await send("auth/change-password", "PUT", { ...password, userId: 99 }))
      .status,
    400,
  );
  assert.equal(
    (await send("auth/change-password", "PUT", password)).status,
    200,
  );
  assert.deepEqual(passwordCalls[0], [
    "test-session",
    password.previousPassword,
    password.proposedPassword,
    7,
  ]);
});
