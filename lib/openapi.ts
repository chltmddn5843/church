export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "원당교회 웹사이트 API",
    version: "1.0.0",
    description:
      "현재 프로젝트에서 외부 HTTP로 호출할 수 있는 API 명세입니다. 설교·게시글·갤러리·팝업 관리는 Next.js Server Action을 사용하므로 이 REST API 목록에는 포함되지 않습니다.",
  },
  servers: [{ url: "/", description: "현재 서버" }],
  tags: [
    { name: "Auth", description: "Better Auth 이메일·비밀번호 인증" },
    { name: "Uploads", description: "공개 팝업 이미지 조회" },
    { name: "Documentation", description: "OpenAPI 명세 조회" },
  ],
  paths: {
    "/api/auth/sign-up/email": {
      post: {
        tags: ["Auth"],
        summary: "회원가입",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignUpRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "가입 및 자동 로그인 성공",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "422": { description: "이미 가입된 사용자 또는 사용자 생성 실패" },
        },
      },
    },
    "/api/auth/sign-in/email": {
      post: {
        tags: ["Auth"],
        summary: "이메일 로그인",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/SignInRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "로그인 성공. 응답과 함께 세션 쿠키가 설정됩니다.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          "400": { $ref: "#/components/responses/BadRequest" },
          "401": { description: "이메일 또는 비밀번호 불일치" },
        },
      },
    },
    "/api/auth/get-session": {
      get: {
        tags: ["Auth"],
        summary: "현재 세션 조회",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "로그인하지 않은 경우 JSON null을 반환합니다.",
            content: {
              "application/json": {
                schema: {
                  anyOf: [
                    { $ref: "#/components/schemas/SessionResponse" },
                    { type: "null" },
                  ],
                },
              },
            },
          },
        },
      },
    },
    "/api/auth/sign-out": {
      post: {
        tags: ["Auth"],
        summary: "로그아웃",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "로그아웃 성공",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", example: true } },
                  required: ["success"],
                },
              },
            },
          },
        },
      },
    },
    "/api/uploads/popups/{fileName}": {
      get: {
        tags: ["Uploads"],
        summary: "팝업 이미지 조회",
        parameters: [
          {
            name: "fileName",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "550e8400-e29b-41d4-a716-446655440000.png",
          },
        ],
        responses: {
          "200": {
            description: "이미지 바이너리",
            content: {
              "image/jpeg": { schema: { type: "string", format: "binary" } },
              "image/png": { schema: { type: "string", format: "binary" } },
              "image/webp": { schema: { type: "string", format: "binary" } },
              "image/gif": { schema: { type: "string", format: "binary" } },
            },
          },
          "404": { description: "이미지를 찾을 수 없음" },
        },
      },
    },
    "/api/openapi": {
      get: {
        tags: ["Documentation"],
        summary: "OpenAPI JSON 조회",
        responses: {
          "200": {
            description: "OpenAPI 3.1 문서",
            content: { "application/json": { schema: { type: "object" } } },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: { type: "apiKey", in: "cookie", name: "better-auth.session_token" },
    },
    schemas: {
      SignUpRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "홍길동" },
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", minLength: 8, example: "password123" },
          rememberMe: { type: "boolean", default: true },
        },
        required: ["name", "email", "password"],
      },
      SignInRequest: {
        type: "object",
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", example: "password123" },
          rememberMe: { type: "boolean", default: true },
        },
        required: ["email", "password"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          emailVerified: { type: "boolean" },
          image: { anyOf: [{ type: "string", format: "uri" }, { type: "null" }] },
          role: { type: "string", example: "member" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "email", "emailVerified", "role"],
      },
      Session: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          token: { type: "string" },
          expiresAt: { type: "string", format: "date-time" },
          ipAddress: { anyOf: [{ type: "string" }, { type: "null" }] },
          userAgent: { anyOf: [{ type: "string" }, { type: "null" }] },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          redirect: { type: "boolean", example: false },
          token: { type: "string" },
          url: { anyOf: [{ type: "string" }, { type: "null" }] },
          user: { $ref: "#/components/schemas/User" },
        },
        required: ["user"],
      },
      SessionResponse: {
        type: "object",
        properties: {
          session: { $ref: "#/components/schemas/Session" },
          user: { $ref: "#/components/schemas/User" },
        },
        required: ["session", "user"],
      },
      Error: {
        type: "object",
        properties: {
          code: { type: "string" },
          message: { type: "string" },
        },
      },
    },
    responses: {
      BadRequest: {
        description: "잘못된 요청",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
    },
  },
} as const
