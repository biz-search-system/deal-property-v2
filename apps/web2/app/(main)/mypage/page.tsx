import { verifySession } from "@/lib/sesstion";

export default async function page() {
  const session = await verifySession();
  const user = session.user;

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">My Page</h1>
    </div>
  );
}
