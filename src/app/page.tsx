import Link from "next/link";

export default function Home() {
  return (
    <div>
      <p>AI Web Apps</p>
      <ul className="list-disc pl-4">
        <li>
          <Link href="/neurovault" className="underline">
            Neurovault
          </Link>
        </li>
        <li>
          <Link href="/docubuddy" className="underline">
            DocuBuddy
          </Link>
        </li>
      </ul>
    </div>
  );
}
