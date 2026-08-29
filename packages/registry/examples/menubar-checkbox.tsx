import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

export default function MenubarCheckbox() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem defaultChecked>
            Always show bookmarks bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem>Always show full URLs</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarCheckboxItem>Show tab preview</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
