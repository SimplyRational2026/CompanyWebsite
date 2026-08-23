"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Any URL that doesn't match a real route (`/`, `/impressum`, `/datenschutz`,
// `/entscheidungsbarometer`) lands here and gets redirected to the homepage.
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  return null;
}
