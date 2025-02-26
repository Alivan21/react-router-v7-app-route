import { useParams } from "react-router";

export default function DetailUserPage() {
  const { id } = useParams();
  return <div>DetailUserPage: {id}</div>;
}
