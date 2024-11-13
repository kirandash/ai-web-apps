import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen justify-center items-center flex-col space-y-4">
      <h1 className="text-3xl">AI Web Apps</h1>
      <ul className="list-disc pl-4">
        <li>
          <Link href="/neurovault" className="underline">
            Neurovault
          </Link>
        </li>
        <li>
          <Link href="/streamflow" className="underline">
            StreamFlow
          </Link>
        </li>
        <li>
          <Link href="/docubuddy" className="underline">
            DocuBuddy
          </Link>
        </li>
        <li>
          <Link href="/vidinteract" className="underline">
            VidInteract
          </Link>
        </li>
      </ul>
    </div>
  );
}
