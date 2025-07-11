'use client';

import { Star } from 'lucide-react';
import { useMemo, useState } from 'react';

import { MAX_ICONS_TO_DISPLAY, iconNames } from '~constants/icons';
import { cn } from '~lib/utils';
import { useSettingsStore } from '~stores/settingStore';
import { IconName } from '~types/app';
import { Button } from '~ui/button';
import Icon from '~ui/icon';
import { Input } from '~ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '~ui/popover';
import { ScrollArea } from '~ui/scroll-area';
import { Separator } from '~ui/separator';

interface SelectIconProps {
  value?: string;
  onChange: (value?: string) => void;
  className?: string;
}

export function SelectIcon({ value, onChange, className }: SelectIconProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { appSetting, addFavoriteIcon, removeFavoriteIcon, addRecentIcon } = useSettingsStore();
  const { favoriteIcons, recentIcons } = appSetting;

  const handleIconSelect = (iconName: IconName) => {
    onChange(iconName);
    addRecentIcon(iconName);
    setIsOpen(false);
    setSearch('');
  };

  const toggleFavorite = (e: React.MouseEvent, iconName: IconName) => {
    e.stopPropagation();
    if (favoriteIcons.includes(iconName)) {
      removeFavoriteIcon(iconName);
    } else {
      addFavoriteIcon(iconName);
    }
  };

  const filteredIcons = useMemo(() => {
    const allIcons = iconNames;

    if (!search) {
      return allIcons.slice(0, MAX_ICONS_TO_DISPLAY);
    }
    return allIcons.filter((name) => name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const renderIconList = (icons: IconName[], withFavoriteButton = false, type = 'icon') => (
    <div className="grid grid-cols-6 gap-1 p-2">
      {icons.map((iconName) => (
        <div
          key={`${type}-${iconName}`}
          className="group relative flex justify-center items-center"
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleIconSelect(iconName)}
            className={cn(
              'h-10 w-10 rounded-md group-hover:bg-accent',
              value === iconName && 'bg-accent text-accent-foreground',
            )}
          >
            <Icon name={iconName} className="h-5 w-5" />
          </Button>
          {withFavoriteButton && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute -right-1 -top-1 hidden h-5 w-5 group-hover:flex"
              onClick={(e) => toggleFavorite(e, iconName)}
            >
              <Star
                className={cn(
                  'h-3 w-3',
                  favoriteIcons.includes(iconName)
                    ? 'fill-yellow-400 text-yellow-500'
                    : 'text-muted-foreground',
                )}
              />
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn('w-full justify-start text-left font-normal', className)}
        >
          {value ? (
            <div className="flex items-center gap-2">
              <Icon name={value as IconName} className="h-4 w-4" />
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
          {!search && (
            <>
              {favoriteIcons?.length > 0 && (
                <>
                  <div className="p-2 text-xs text-muted-foreground">Favorites</div>
                  {renderIconList(favoriteIcons, true, 'favorite')}
                  <Separator />
                </>
              )}
              {recentIcons?.length > 0 && (
                <>
                  <div className="p-2 text-xs text-muted-foreground">Recents</div>
                  {renderIconList(recentIcons, true, 'recent')}
                  <Separator />
                </>
              )}
            </>
          )}
          <div className="p-2 text-xs text-muted-foreground">Icons</div>
          {renderIconList(filteredIcons, true, 'icon')}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
