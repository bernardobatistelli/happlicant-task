 
 
import { tv } from "tailwind-variants";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}
const root = tv({
  base: "mx-auto flex w-full max-w-7xl flex-col px-5 py-8 lg:py-12 min-[100rem]:px-0",
});

export function Container({ children, className }: ContainerProps) {
  return <section className={root({ className })}>{children}</section>;
}