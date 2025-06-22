import { ChevronsUpDown } from 'lucide-react';

import { Button } from '~ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~ui/collapsible';

interface SettingsItemProps {
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const SettingsItem = ({ title, open, onOpenChange, children }: SettingsItemProps) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className="flex flex-col gap-2">
      <CollapsibleTrigger asChild>
        <div className="flex items-center justify-between gap-4 px-4 bg-primary-foreground">
          <h4 className="text-sm font-semibold">{title}</h4>

          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </Button>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="flex flex-col gap-2 px-4">{children}</CollapsibleContent>
    </Collapsible>
  );
};

export default SettingsItem;
