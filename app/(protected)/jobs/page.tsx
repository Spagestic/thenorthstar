import React from "react";
import { createClient } from "@/lib/supabase/server";
import Header from "../Header";

export default async function page() {
  const supabase = await createClient();

  return (
    <div>
      <Header nav={["Jobs"]} />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-8 overflow-hidden"></div>
    </div>
  );
}
