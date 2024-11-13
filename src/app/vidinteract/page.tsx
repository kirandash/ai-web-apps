import YouTubeForm from "@/app/vidinteract/YouTubeForm";
import Title from "@/components/Title";

export default function VidInteractHome() {
  return (
    <div className="flex flex-col w-full space-y-8 p-8 max-w-3xl sm:min-w-3xl mx-auto justify-center items-center min-h-screen">
      <Title title="VidInteract" />
      <p className="text-sm">
        VidInteract is a tool that helps you interact with a youtube video.
      </p>
      <YouTubeForm />
    </div>
  );
}
