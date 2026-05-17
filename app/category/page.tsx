import { permanentRedirect } from "next/navigation";

export default function CategoryIndexRedirect() {
  permanentRedirect("/categories");
}

