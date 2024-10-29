import StreamForm from "@/app/streamflow/StreamForm";
import Title from "@/components/Title";

export default function StreamFlowHome() {
  return (
    <div className="flex flex-col w-full space-y-8 p-8 max-w-3xl sm:min-w-3xl mx-auto justify-center items-center min-h-screen">
      <Title title="StreamFlow" />
      <p className="text-sm">
        Streaming your LLM response is a vital part of the UX to help alleviate
        latency issues.
      </p>
      <StreamForm />
    </div>
  );
}
