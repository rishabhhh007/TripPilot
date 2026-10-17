import { AppError } from "../utils/AppError.js";

// Request body validation without extra packages.
//
// Describe the allowed fields once, and use it as middleware:
//
//   const registerRules = {
//     name:     { type: "string", required: true, minLength: 2, maxLength: 60 },
//     email:    { type: "string", required: true, pattern: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
//     travelers:{ type: "number", min: 1, max: 20, integer: true },
//   };
//   router.post("/register", validateBody(registerRules), registerController);
//
// After it runs, req.body contains ONLY the listed fields, cleaned (trimmed, converted).
// Unknown fields are dropped, so nobody can sneak in extra data like { role: "admin" }.
//
// Supported types: "string" | "number" | "boolean" | "array" | "date" (YYYY-MM-DD)
// Supported rules: required, minLength, maxLength, min, max, integer, pattern, oneOf, message

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function checkField(name, rule, raw) {
  const missing = raw === undefined || raw === null || raw === "";
  if (missing) {
    return rule.required ? { error: `${name} is required` } : { skip: true };
  }

  let value = raw;

  switch (rule.type) {
    case "string": {
      if (typeof value !== "string") return { error: `${name} must be text` };
      value = value.trim();
      if (rule.required && value === "") return { error: `${name} is required` };
      if (rule.minLength && value.length < rule.minLength) return { error: `${name} must be at least ${rule.minLength} characters` };
      if (rule.maxLength && value.length > rule.maxLength) return { error: `${name} must be at most ${rule.maxLength} characters` };
      if (rule.pattern && !rule.pattern.test(value)) return { error: rule.message || `${name} is not valid` };
      break;
    }
    case "number": {
      const n = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
      if (typeof n !== "number" || !Number.isFinite(n)) return { error: `${name} must be a number` };
      if (rule.integer && !Number.isInteger(n)) return { error: `${name} must be a whole number` };
      if (rule.min !== undefined && n < rule.min) return { error: `${name} must be at least ${rule.min}` };
      if (rule.max !== undefined && n > rule.max) return { error: `${name} must be at most ${rule.max}` };
      value = n;
      break;
    }
    case "boolean": {
      if (typeof value !== "boolean") return { error: `${name} must be true or false` };
      break;
    }
    case "array": {
      if (!Array.isArray(value)) return { error: `${name} must be a list` };
      if (rule.maxLength && value.length > rule.maxLength) return { error: `${name} has too many items` };
      break;
    }
    case "object": {
      if (typeof value !== "object" || Array.isArray(value)) return { error: `${name} must be an object` };
      break;
    }
    case "date": {
      if (typeof value !== "string" || !DATE_PATTERN.test(value) || Number.isNaN(Date.parse(value))) {
        return { error: `${name} must be a date like 2026-12-31` };
      }
      break;
    }
    default:
      throw new Error(`validateBody: unknown type "${rule.type}" for field "${name}"`);
  }

  if (rule.oneOf && !rule.oneOf.includes(value)) {
    return { error: `${name} must be one of: ${rule.oneOf.join(", ")}` };
  }

  return { value };
}

export function validateBody(rules) {
  return (req, res, next) => {
    const body = req.body && typeof req.body === "object" && !Array.isArray(req.body) ? req.body : {};
    const clean = {};
    const details = [];

    for (const [name, rule] of Object.entries(rules)) {
      const result = checkField(name, rule, body[name]);
      if (result.error) details.push({ field: name, message: result.error });
      else if (!result.skip) clean[name] = result.value;
    }

    if (details.length > 0) return next(new AppError(400, "Validation failed", details));

    req.body = clean;
    next();
  };
}