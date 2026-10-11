import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import miPredictLogo from "../assets/logos/mipredict2.0_logo_nav.svg";
import { validateEmail, validatePassword } from "../utils/validation.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/app";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit({ email, password }) {
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to sign in. Please try again.");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-pitch px-5 py-10 text-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />

      <Link
        to="/"
        className="mb-8 flex items-center gap-2"
        aria-label="Mi Predict home"
      >
        <img
          src={miPredictLogo}
          alt="Mi Predict logo"
          className="h-12 w-auto object-contain"
        />
        <span className="font-display text-lg font-bold tracking-tight sm:text-xl">
          Mi<span className="text-brand">Predict</span>
          <span className="ml-1 text-xs font-medium text-text-secondary">
            2.0
          </span>
        </span>
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Sign in to keep your predictions on track.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", { validate: validateEmail })}
          />

          <Input
            label="Password"
            type="password"
            revealable
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            {...register("password", { validate: validatePassword })}
          />

          <Button
            type="submit"
            size="md"
            className="w-full"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          New to Mi Predict?{" "}
          <Link
            to="/register"
            className="font-semibold text-brand transition hover:text-brand-hover"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}