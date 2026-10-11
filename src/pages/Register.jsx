import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import miPredictLogo from "../assets/logos/mipredict2.0_logo_nav.svg";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/validation.js";

export default function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit({ name, email, password }) {
    try {
      await signup({ name, email, password });
      toast.success("Account created. Welcome!");
      navigate("/app", { replace: true });
    } catch (error) {
      toast.error(error.message || "Unable to create your account. Please try again.");
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
          Join Mi Predict
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Create an account and start making your calls.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="Name"
            type="text"
            autoComplete="name"
            placeholder="How should we call you?"
            error={errors.name?.message}
            {...register("name", { validate: validateName })}
          />

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
            autoComplete="new-password"
            placeholder="At least 8 characters with a letter and a number"
            error={errors.password?.message}
            {...register("password", { validate: validatePassword })}
          />

          <Input
            label="Confirm password"
            type="password"
            revealable
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              validate: (value) =>
                validateConfirmPassword(value, getValues("password")),
            })}
          />

          <Button
            type="submit"
            size="md"
            className="w-full"
            loading={isSubmitting}
          >
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-brand transition hover:text-brand-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}