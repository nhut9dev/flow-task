import BreadcrumbCurrent from '~components/BreadcrumbCurrent';
import { SidebarTrigger } from '~ui/sidebar';

const Header = () => {
  return (
    <header className="flex items-center h-8">
      <SidebarTrigger />
      <BreadcrumbCurrent />
    </header>
  );
};

export default Header;
