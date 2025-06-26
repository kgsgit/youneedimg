import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    alert("로그아웃 되었습니다");
    setUser(null);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>youneedimg</h1>

      {user ? (
        <>
          <p>안녕하세요, {user.email} 님</p>
          <button onClick={handleLogout}>로그아웃</button>
        </>
      ) : (
        <>
          <p>로그인 상태가 아닙니다.</p>
        </>
      )}
    </main>
  );
}
