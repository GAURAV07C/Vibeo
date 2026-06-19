"use client";
import { signIn, useSession, signOut } from "next-auth/react";

function Appbar() {
  const session = useSession();
  return (
    <div>
      <div className="flex justify-between">
        <div>Vibeo</div>
        <div>
          {session.data?.user ? (
            <button className="m-2 p-2 bg-blue-4`" onClick={() => signOut()}>
              Logout
            </button>
          ) : (
            <button className="m-2 p-2 bg-blue-4`" onClick={() => signIn()}>
              SignIn
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Appbar;
