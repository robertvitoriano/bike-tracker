import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
interface IProps {
  open: boolean;
  className: string;
}
export function DropdownMenuCheckboxes(props: IProps) {
  return (
    <>
      <DropdownMenu open={props.open}>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Locations found</DropdownMenuLabel>
          <DropdownMenuItem>Mairinque</DropdownMenuItem>
          <DropdownMenuSeparator />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
