import React from "react";
import NavigationItem from "./NavigationItem";
import { ALMARI_NAVIGATION } from "@/data/navigation";

function Navigation() {
  return (
    <ul className="nc-Navigation flex items-center">
      {ALMARI_NAVIGATION.map((item) => (
        <NavigationItem key={item.id} menuItem={item} />
      ))}
    </ul>
  );
}

export default Navigation;
