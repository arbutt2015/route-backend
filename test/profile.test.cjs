const { test } = require("node:test");
const assert = require("node:assert/strict");
require("reflect-metadata");
const { ValidationPipe } = require("@nestjs/common");
const { AdmUserService } = require("../src/adm-user/adm-user.service");
const { AdmUserController } = require("../src/adm-user/adm-user.controller");
const { AuthController } = require("../src/auth/auth.controller");
const { UpdateProfileDto } = require("../src/adm-user/dto/update-profile.dto");
const { ChangePasswordDto } = require("../src/auth/dto/change-password.dto");
const { SKIP_AUTH_KEY } = require("../src/auth/skip-auth.decorator");

const profile = {
  firstName: "Amina",
  middleInitial: "",
  lastName: "Example",
  companyName: "Example",
  title: "Engineer",
  phoneNumber: "0123456789",
};
const user = {
  userId: 7,
  email: "amina@example.com",
  ...profile,
  isPasswordChangeRequired: false,
  cognitoId: "private-sub",
  collectorCode: "ABCDE",
  usersAccess: true,
};
const pipe = new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
});
const validate = (metatype, value) =>
  pipe.transform(value, { type: "body", metatype });

test("profile input trims fields and rejects account and permission changes", async () => {
  const valid = await validate(UpdateProfileDto, {
    ...profile,
    firstName: " Amina ",
  });
  assert.equal(valid.firstName, "Amina");
  for (const extra of [
    { userId: 99 },
    { usersAccess: true },
    { isActive: false },
    { email: "other@example.com" },
  ]) {
    await assert.rejects(validate(UpdateProfileDto, { ...profile, ...extra }));
  }
  await assert.rejects(
    validate(UpdateProfileDto, { ...profile, firstName: "   " }),
  );
  await assert.rejects(
    validate(UpdateProfileDto, { ...profile, companyName: "x".repeat(201) }),
  );
});

test("profile reads expose only public fields", async () => {
  const service = new AdmUserService({ getUser: async () => user }, {});
  const result = await service.getProfile(7);
  assert.equal(result.email, user.email);
  assert.equal(result.title, profile.title);
  for (const field of ["cognitoId", "collectorCode", "usersAccess"])
    assert(!Object.hasOwn(result, field));
});

test("profile update uses authenticated identity and whitelists persisted fields", async () => {
  let saved;
  const repo = {
    updateUserByWhereAndGetData: async (filter, body) => {
      saved = { filter, body };
      return [{ ...user, ...body }];
    },
  };
  const service = new AdmUserService(repo, {});
  const controller = new AdmUserController(service, {});
  const result = await controller.updateProfile(
    { user: { userId: 7 } },
    { ...profile, firstName: "Updated", userId: 99, usersAccess: true },
  );
  assert.deepEqual(saved.filter, { where: { userId: 7 } });
  assert.equal(saved.body.firstName, "Updated");
  assert(!Object.hasOwn(saved.body, "userId"));
  assert(!Object.hasOwn(saved.body, "usersAccess"));
  assert.equal(result.data.firstName, "Updated");
});

test("missing profiles return 404", async () => {
  const service = new AdmUserService(
    { getUser: async () => null, updateUserByWhereAndGetData: async () => [] },
    {},
  );
  await assert.rejects(
    service.getProfile(7),
    (error) => error.getStatus() === 404,
  );
  await assert.rejects(
    service.updateProfile(7, profile),
    (error) => error.getStatus() === 404,
  );
});

test("password endpoint overrides public-controller metadata and uses JWT identity", async () => {
  assert.equal(
    Reflect.getMetadata(SKIP_AUTH_KEY, AuthController.prototype.changePassword),
    false,
  );
  let received;
  const controller = new AuthController(
    {
      changePassword: async (...args) => {
        received = args;
        return {};
      },
    },
    {},
  );
  await controller.changePassword(
    { user: { userId: 7 }, headers: { authorization: "Bearer mock-access" } },
    {
      previousPassword: "OldPassword123!",
      proposedPassword: "NewPassword123!",
    },
  );
  assert.deepEqual(received, [
    "mock-access",
    "OldPassword123!",
    "NewPassword123!",
    7,
  ]);
  await assert.rejects(
    validate(ChangePasswordDto, {
      previousPassword: "old",
      proposedPassword: "weak",
    }),
  );
  await assert.rejects(
    validate(ChangePasswordDto, {
      previousPassword: "old",
      proposedPassword: "NewPassword123!",
      userId: 99,
    }),
  );
});

test("wrong current password is a client error, not a server error", async () => {
  const controller = new AuthController(
    {
      changePassword: async () => {
        throw { code: "NotAuthorizedException" };
      },
    },
    {},
  );
  await assert.rejects(
    controller.changePassword(
      { user: { userId: 7 }, headers: { authorization: "Bearer mock-access" } },
      { previousPassword: "wrong", proposedPassword: "NewPassword123!" },
    ),
    (error) => error.getStatus() === 400,
  );
});
