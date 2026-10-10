import { useState } from "react";

export default function LaunchSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          website: "",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed. Try again.");
      }

      setStatus("success");
      setMessage(data.message || "You're on the list!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.message || "Something went wrong. Please try again."
      );
    }
  }

  return (
    <section
      id="notify"
      className="w-full px-5 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center sm:p-10">
        <span className="inline-flex rounded-full border border-[#B8FF3B]/30 bg-[#B8FF3B]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#B8FF3B]">
          Mi Predict 2.0
        </span>

        <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Be first to know.
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-gray-400 sm:text-base">
          A new prediction experience is coming.
          Join the launch list and we'll keep you updated.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="launch-email" className="sr-only">
            Your email address
          </label>

          <input
            id="launch-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={254}
            disabled={status === "loading"}
            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#111] px-4 py-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-[#B8FF3B]"
          />

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-xl bg-[#B8FF3B] px-6 py-3.5 font-bold text-black transition hover:bg-[#c9ff70] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Joining..." : "Notify me"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 text-sm ${
              status === "error"
                ? "text-red-400"
                : "text-[#B8FF3B]"
            }`}
          >
            {message}
          </p>
        )}

        <p className="mt-5 text-xs text-gray-500">
          No spam. Just updates about the launch.
        </p>
      </div>
    </section>
  );
}