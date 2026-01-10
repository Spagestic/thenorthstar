"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function ErrorToaster({ error }: { error?: string | any }) {
  useEffect(() => {
    if (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message || JSON.stringify(error);
      toast.error(
        <div>
          <span className="font-bold">Error</span>
          <p className="text-xs">{message}</p>
        </div>
      );
    }
  }, [error]);

  return null;
}
