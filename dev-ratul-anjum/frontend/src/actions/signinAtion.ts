"use server";

import { forwardCookie } from "@/lib/cookies";
import { signinSchema } from "@/schema/signinSchema";
import { redirect } from "next/navigation";

const signinAction = async (prevState: FormState, formData: FormData) => {
  const rowData = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const values = {
    email: rowData.email,
    password: rowData.password,
  };

  // Zod validation
  const parsed = signinSchema.safeParse(rowData);

  if (!parsed.success) {
    const errors: NonNullable<FormState["errors"]> = {};
    parsed.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof NonNullable<FormState["errors"]>;
      errors[field] = issue.message;
    });

    return { values, errors };
  }

  //   Send to backend
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/v1/login`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          ...parsed.data,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    // Forward backend Set-Cookie to browser
    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      await forwardCookie(setCookieHeader);
    }

    const result = await response.json();

    if (!result.success) {
      const errors: FormState["errors"] = {};

      if (result?.errors?.length > 0) {
        result.errors?.forEach((error: { path: string; message: string }) => {
          const field = error.path as keyof FormState["errors"];
          errors[field] = error.message;
        });
      } else {
        errors.general = result?.message;
      }

      return { values, errors };
    }
  } catch (error) {
    const errors: FormState["errors"] = {
      general: error instanceof Error ? error.message : "Something went wrong",
    };

    return { values, errors };
  }

  redirect("/rooms");
};

export default signinAction;

export type FormState = {
  values: {
    email: string;
    password: string;
  };
  errors: Partial<Record<"email" | "password" | "general", string>>;
};
