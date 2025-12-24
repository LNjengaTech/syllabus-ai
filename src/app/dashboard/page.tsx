import Navbar from "@/src/components/Navbar";
import UploadZone from "@/src/components/UploadZone";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-5xl mx-auto py-12 px-4">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold">Your Study Center</h1>
          <p className="text-muted-foreground">Upload your course materials to generate guides</p>
        </header>

        <section>
          <UploadZone />
        </section>
      </div>
    </div>
  );
}