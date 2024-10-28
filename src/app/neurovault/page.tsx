import PromptForm from "@/app/neurovault/PromptForm";
import Title from "@/components/Title";

export default function NeurovaultHome() {
  return (
    <div className="flex flex-col w-full space-y-8 p-8 max-w-3xl sm:min-w-3xl mx-auto justify-center items-center min-h-screen">
      <Title title="Neurovault" />
      <PromptForm />
    </div>
  );
}
