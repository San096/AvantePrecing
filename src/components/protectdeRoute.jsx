import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "/src/components/firebase";

export default function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  // Se não está logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
