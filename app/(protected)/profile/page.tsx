import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
import Header from "../Header";
import { Suspense } from "react";

export default function Page() {
  return (
    <div>
      <Header nav={["Profile"]} />
      <div className="container mx-auto space-y-6 px-4">
        <Suspense>
          <ProfileHeader />
        </Suspense>
        <Suspense>
          <ProfileContent />
        </Suspense>
      </div>
    </div>
  );
}
