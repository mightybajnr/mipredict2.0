export const NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(value = "") {
  const email = value.trim();

  if (!email) {
    return "Email is required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Enter a valid email address.";
  }

  return null;
}

export function validateName(value = "") {
  const name = value.trim();

  if (!name) {
    return "Name is required.";
  }

  if (name.length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (name.length > NAME_MAX_LENGTH) {
    return `Name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  }

  return null;
}

export function validatePassword(value = "") {
  if (!value) {
    return "Password is required.";
  }

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
    return "Password must include a letter and a number.";
  }

  return null;
}

export function validateConfirmPassword(value = "", password = "") {
  if (!value) {
    return "Confirm your password.";
  }

  if (value !== password) {
    return "Passwords do not match.";
  }

  return null;
}