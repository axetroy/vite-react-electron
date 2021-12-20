import { useCallback, useState } from "react";

export function useToggle(defaultValue = false): [boolean, () => void] {
  const [value, setValue] = useState(defaultValue);

  // Define and memorize toggler function in case we pass down the comopnent,
  // This function change the boolean value to it's opposite value
  const toggle = useCallback(() => setValue(state => !state), []);

  return [value, toggle];
}
