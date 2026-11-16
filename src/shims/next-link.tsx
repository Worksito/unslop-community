import type { AnchorHTMLAttributes } from "react";

// Remplace next/link dans la vitrine (pas de Next.js ici) : un lien ordinaire suffit pour les démos.
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function Link({ href, children, ...rest }: LinkProps) {
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
