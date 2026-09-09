import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 px-2.5 gap-1.5 font-mono text-xs" aria-label="Change language">
          <Globe className="h-4 w-4" />
          <span className="font-semibold uppercase">{lang}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setLang("ko")}
          className={lang === "ko" ? "font-bold bg-muted/50" : ""}
        >
          🇰🇷 한국어 (KO)
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLang("en")}
          className={lang === "en" ? "font-bold bg-muted/50" : ""}
        >
          🇺🇸 English (EN)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
