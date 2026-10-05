// functions/_middleware.ts

interface Env {
  ANALYTICS_USER: string;
  ANALYTICS_PASS: string;
  PLAUSIBLE_API_KEY: string;
}

export const onRequest = async (context: {
  request: Request;
  next: () => Promise<Response>;
  env: Env;
}) => {
  const { request, next, env } = context;
  const url = new URL(request.url);

  // Only enforce password protection on the analytics subdomain or route
  if (url.hostname === "analytics.rjmlaird.co.uk" || url.pathname.startsWith("/analytics")) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
      return new Response("Authentication required", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Analytics Dashboard"',
        },
      });
    }

    const base64Credentials = authHeader.split(" ")[1];
    let credentials: string;
    try {
      credentials = atob(base64Credentials);
    } catch {
      return new Response("Invalid authorization credentials", { status: 400 });
    }

    const [username, password] = credentials.split(":");

    // Fall back to safe defaults if env vars aren't set yet locally
    const validUser = env.ANALYTICS_USER || "admin";
    const validPass = env.ANALYTICS_PASS || "password";

    if (username !== validUser || password !== validPass) {
      return new Response("Invalid credentials", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Analytics Dashboard"',
        },
      });
    }
  }

  return next();
};