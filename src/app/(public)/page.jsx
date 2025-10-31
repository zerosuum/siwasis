import { getAdminProfile } from "@/lib/session";
export default async function HomePage() {
  const profile = await getAdminProfile();
  const isLoggedIn = !!profile;

  return (
    <div>
      <h1>Selamat Datang di SiWASIS (Homepage)</h1>
      <p>Slicing screenshot-mu masuk ke sini.</p>

      {isLoggedIn && (
        <div className="bg-yellow-200 p-4">
          ADMIN MODE: Kamu bisa edit hero, dll.
        </div>
      )}
    </div>
  );
}
