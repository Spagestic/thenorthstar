import ProfileHeader from "./components/profile-header";
import ProfileContent from "./components/profile-content";
import Header from "../Header";
export default function Page() {
  return (
    <div>
      <Header nav={["Profile"]} />
      <div className="container mx-auto space-y-6 px-4">
        <ProfileHeader />
        <ProfileContent />
      </div>
    </div>
  );
}
