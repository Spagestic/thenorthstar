import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Calendar, Mail, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function ProfileHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Format join date as 'Month Year'
  function formatJoinDate(dateString?: string) {
    if (!dateString) return "March 2023";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "March 2023";
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={user?.user_metadata?.avatar_url || ""}
                alt={user?.user_metadata?.full_name || ""}
              />
              <AvatarFallback className="rounded-lg">
                {user?.user_metadata?.full_name?.charAt(0) ||
                  user?.email?.charAt(0) ||
                  "?"}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
            >
              <Camera />
            </Button>
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">
                {user?.user_metadata?.full_name || user?.email}
              </h1>
            </div>
            <p className="text-muted-foreground">Senior Product Designer</p>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user?.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {user?.user_metadata?.location || "Not Provided"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Joined {formatJoinDate(user?.created_at)}
              </div>
            </div>
          </div>
          <Button variant="default">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  );
}
