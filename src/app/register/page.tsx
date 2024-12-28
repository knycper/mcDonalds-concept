import LoadingSuspense from "../components/LoadingSuspense";
import Register from "../components/Register";

export default function RegisterPage() {
  return (
    <div>
      <LoadingSuspense>
        <Register/>
      </LoadingSuspense>
    </div>
  );
}
