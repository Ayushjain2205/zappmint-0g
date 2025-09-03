import { ComponentProps } from "react";
import Image from "next/image";
export default function LogoSmall(props: ComponentProps<"svg">) {
  return (
    <Image src="/new_logo.png" alt="ZapForge Logo" width={40} height={40} />
  );
}
