import { useAuth } from "../../contexts/AuthContext";

function Counter() {
  const { currentUser } = useAuth();
  return (
    <span className="header__count">({currentUser?.likes.length ?? 0})</span>
  );
}

export default Counter;
