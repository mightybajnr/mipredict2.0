export async function onRequestPost({ request, env }) {
  const respond = (status, message) =>
    Response.json(
      { message },
      {
        status,
        headers: { "Cache-Control": "no-store" },
      }
    );

  if (!env.DB) {
    return respond(500, "Signup is temporarily unavailable.");
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return respond(400, "Invalid request.");
  }

  // Basic honeypot spam check.
  if (typeof data.website === "string" && data.website.trim()) {
    return respond(200, "Thanks! You're on the list.");
  }

  if (typeof data.email !== "string") {
    return respond(400, "Please enter a valid email address.");
  }

  const email = data.email.trim().toLowerCase();

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return respond(400, "Please enter a valid email address.");
  }

  try {
    const result = await env.DB
      .prepare(
        "INSERT OR IGNORE INTO launch_signups (email) VALUES (?)"
      )
      .bind(email)
      .run();

    if (result.meta.changes === 0) {
      return respond(200, "You're already on the list!");
    }

    return respond(
      201,
      "You're on the list! We'll let you know when Mi Predict 2.0 launches."
    );
  } catch {
    return respond(500, "We couldn't save your signup. Please try again.");
  }
}