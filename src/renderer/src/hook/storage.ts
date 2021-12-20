import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useLocalStorage(
  key: string,
  defaultValue: string
): [string, Dispatch<SetStateAction<string>>] {
  const [value, setValue] = useState(localStorage.getItem(key) || defaultValue);

  useEffect(() => {
    function onStorageChange(event: StorageEvent) {
      if (event.key !== key) return;

      setValue(event.newValue || "");
    }

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  });

  function setItem(newVal: string | ((prevState: string) => string)) {
    setValue(newVal);
    if (typeof newVal === "function") {
      localStorage.setItem(key, newVal(value));
    } else {
      localStorage.setItem(key, newVal);
    }
  }

  return [value, setItem];
}
