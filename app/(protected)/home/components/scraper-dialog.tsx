"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ScraperInterface } from "../scraper-interface";
import { useState } from "react";

export function ScraperDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Jobs</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scrape Jobs</DialogTitle>
          <DialogDescription>
            Enter a job board URL to scrape and import job postings.
          </DialogDescription>
        </DialogHeader>
        <ScraperInterface onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
