import { doLogin } from "./actions";

export default function LoginPage() {
 return (
 <form action={doLogin} className="max-w-sm space-y-3">
 <input name="email" className="border p-2 w-full" placeholder="email" />
 <input
 name="password"
 type="password"
 className="border p-2 w-full"
 placeholder="password"
 />
 <button className="px-4 py-2 rounded bg-green-700 text-white">
 Login
 </button>
 </form>
 );
}
