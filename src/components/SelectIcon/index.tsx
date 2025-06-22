'use client';

import { useMemo, useState } from 'react';

import { MAX_ICONS_TO_DISPLAY, iconNames } from '~constants/icons';
import { cn } from '~lib/utils';
import { Button } from '~ui/button';
import Icon from '~ui/icon';
import { Input } from '~ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~ui/popover';
import { ScrollArea } from '~ui/scroll-area';

interface SelectIconProps {
  value?: string;
  onChange: (value?: string) => void;
  className?: string;
}

export function SelectIcon({ value, onChange, className }: SelectIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredIcons = useMemo(() => {
    if (!search) {
      return iconNames.slice(0, MAX_ICONS_TO_DISPLAY);
    }
    return iconNames.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', className)}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Icon name={value as any} className="h-4 w-4" />
              <span>{value}</span>
            </div>
          ) : (
            'Select an icon'
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-2">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="h-64">
          <div className="grid grid-cols-6 gap-1 p-2">
            {filteredIcons.map((iconName) => (
              <Button
                key={iconName}
                variant="ghost"
                size="icon"
                onClick={() => {
                  onChange(iconName);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={cn(
                  'h-10 w-10 rounded-md',
                  value === iconName && 'bg-accent text-accent-foreground',
                )}
              >
                <Icon name={iconName} className="h-5 w-5" />
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
