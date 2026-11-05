import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@/shared/components/ui/button";

export function RepositoryLink({ className }: { className?: string }) {
  return (
    <Button asChild variant="ghost" className={className}>
      <a
        href="https://github.com/laughinme/AutoSpareParts"
        target="_blank"
        rel="noreferrer"
        aria-label="Открыть репозиторий AutoSpare на GitHub"
      >
        <IconBrandGithub className="size-5" aria-hidden="true" />
        <span className="hidden xl:inline">GitHub</span>
      </a>
    </Button>
  );
}
