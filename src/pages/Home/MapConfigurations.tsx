import { useState } from "react";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  Drawer,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { layers } from "@/lib/layers";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { X } from "lucide-react";

export function MapConfigurations({ selectedLayer, setSelectedLayer }) {
  const [openDrawer, setOpenDrawer] = useState(false);

  function handleSelectLayer(layer) {
    setSelectedLayer(layer);
    setOpenDrawer(false);
  }
  return (
    <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)}>
      <FontAwesomeIcon
        icon={faLayerGroup}
        className="text-primary text-4xl cursor-pointer"
        onClick={() => setOpenDrawer(true)}
      />
      <DrawerContent className="h-full">
        <DrawerHeader
          className="flex justify-between py-4"
          style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.2)" }}
        >
          <DrawerTitle>Map Configurations</DrawerTitle>
          <DrawerClose>
            <X />
          </DrawerClose>
        </DrawerHeader>
        <div className="flex flex-col py-4 px-2">
          <h3 className="my-4 font-bold">Map types:</h3>
          <RadioGroup className="">
            {Object.entries(layers).map(([_, { label, url, image }]) => (
              <div
                className={`p-4  cursor-pointer flex justify-between items-center`}
                style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.2)" }}
                onClick={() => handleSelectLayer(url)}
              >
                <div className="flex gap-4 items-center w-full">
                  <img src={image} className="h-16 w-16 rounded-md" />
                  <Label htmlFor="r1" className="text-sm">
                    {label}
                  </Label>
                </div>
                <RadioGroupItem
                  value={label}
                  id="r1"
                  checked={selectedLayer === url}
                />
              </div>
            ))}
          </RadioGroup>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
