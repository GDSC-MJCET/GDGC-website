import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { replayIntro } from "@/components/intro/introEvents";

export function ReplayIntroButton({
  children = "Replay intro",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "onClick">) {
  return (
    <Button type="button" variant="outline" onClick={replayIntro} {...props}>
      <RotateCcw />
      {children}
    </Button>
  );
}
