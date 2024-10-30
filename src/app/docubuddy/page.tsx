import DocumentForm from "@/app/docubuddy/DocumentForm";
import Title from "@/components/Title";

export default function DocuBuddyHome() {
  return (
    <div className="flex flex-col w-full space-y-8 p-8 max-w-3xl sm:min-w-3xl mx-auto justify-center items-center min-h-screen">
      <Title title="DocyBuddy" />
      <p className="text-sm">
        DocuBuddy is a tool that helps you interact with your documents.
      </p>
      <DocumentForm />
    </div>
  );
}
