import { InkUnderline } from "../library/ink-underline";
export default function Demo() {
  return (
    <InkUnderline
      links={[
        { label: "Travaux", href: "#travaux" },
        { label: "Atelier", href: "#atelier" },
        { label: "Contact", href: "#contact" },
      ]}
    />
  );
}
