"use client";

import { Select } from "@base-ui/react/select";
import type { ReactNode } from "react";
import styles from "./icon-select.module.css";

/** One choice: a machine value, its visible label, and an optional pictogram. */
export type IconSelectOption = {
  value: string;
  label: string;
  icon?: ReactNode;
};

type IconSelectProps = {
  /** The trigger's element id, so a visible `<label htmlFor>` can name it. */
  id: string;
  /** Accessible name for the control (the axis it filters, e.g. "Type"). */
  label: string;
  /** The selected option's value; `""` selects the placeholder ("all") option. */
  value: string;
  /** Label of the leading clear option and the trigger text when nothing is selected. */
  placeholder: string;
  options: readonly IconSelectOption[];
  onChange: (value: string) => void;
  "data-testid"?: string;
};

/**
 * A single-select dropdown whose options carry a pictogram next to their text —
 * the one thing a native `<select>` cannot render. Built on Base UI's `Select`
 * so focus management, the ARIA combobox/listbox semantics, keyboard handling,
 * and portalling come from the primitive rather than being hand-rolled (per the
 * project's Component Guidelines). A leading placeholder option (value `""`)
 * clears the selection, mirroring a native select's empty option.
 */
export function IconSelect({
  id,
  label,
  value,
  placeholder,
  options,
  onChange,
  "data-testid": testId,
}: IconSelectProps) {
  // The empty value is a real "all" item, rendered with the placeholder label.
  const allOptions: readonly IconSelectOption[] = [
    { value: "", label: placeholder },
    ...options,
  ];
  const byValue = new Map(allOptions.map((option) => [option.value, option]));
  const items = allOptions.map(({ value, label }) => ({ value, label }));

  return (
    <Select.Root
      items={items}
      value={value}
      onValueChange={(next) => onChange(next ?? "")}
    >
      <Select.Trigger
        id={id}
        aria-label={label}
        className={styles.trigger}
        data-testid={testId}
      >
        <Select.Value>
          {(selected: string) => {
            const option = byValue.get(selected) ?? allOptions[0];
            return (
              <span
                className={styles.triggerValue}
                data-placeholder={option.value === ""}
              >
                {option.icon !== undefined ? (
                  <span className={styles.optionIcon}>{option.icon}</span>
                ) : null}
                <span className={styles.optionLabel}>{option.label}</span>
              </span>
            );
          }}
        </Select.Value>
        <Select.Icon className={styles.chevron} />
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          className={styles.positioner}
          sideOffset={4}
          alignItemWithTrigger={false}
        >
          <Select.Popup className={styles.listbox}>
            {allOptions.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                label={option.label}
                className={styles.option}
                data-testid={
                  testId === undefined ? undefined : `${testId}-option`
                }
              >
                {option.icon !== undefined ? (
                  <span className={styles.optionIcon}>{option.icon}</span>
                ) : null}
                <Select.ItemText className={styles.optionLabel}>
                  {option.label}
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
