import { permanentRedirect } from "next/navigation";

export default function TagIndexRedirect() {
  permanentRedirect("/tags");
}

