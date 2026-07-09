import { Fragment, useEffect, useRef, useState, type ChangeEvent } from "react";
import { useStore } from "@nanostores/react";
import * as store from "./store";

type Option = { key: string, value: string };
type OptionsWithLabel = { label: string, values: Option[] };

interface Props {
  placeholder: string;
  options: (OptionsWithLabel | Option)[];
  max_visible?: number;
  atom_name: "type_filter" | "programme_filter";
}

function has_label(thing: any): thing is OptionsWithLabel {
  return Object.hasOwn(thing, "label");
}

function find_option(options: (OptionsWithLabel | Option)[], key: string) {
  for (const option of options) {
    if (has_label(option)) {
      const res = option.values.find(suboption => suboption.key === key);
      if (res) return res;
    } else {
      if (option.key === key) return option;
    }
  }

  return undefined;
}

export function MultiSelectInput({ placeholder, options, max_visible, atom_name }: Props) {
  const max_visible_ = max_visible ?? 3;
  const [selected_items, set_selected_items] = useState<Option[]>([]);
  const [opened, set_opened] = useState(false);
  const atom = store[atom_name];
  const $atom = useStore(atom);

  const checkbox_changed = (_e: ChangeEvent, key: string) => {
    const removal_index = selected_items.findIndex(item => item.key === key)
    if (removal_index >= 0) {
      atom.set($atom.toSpliced(removal_index, 1));
      set_selected_items(selected_items.toSpliced(removal_index, 1))
    } else {
      const option = find_option(options, key)!;
      atom.set([...$atom, option.value]);
      set_selected_items([...selected_items, option]);
    }
  };

  const container_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!(event.target && container_ref.current?.contains(event.target as Node))) {
        set_opened(false);
      }
    };

    document.addEventListener("click", handler);
    return () => { document.removeEventListener("click", handler) };
  });

  return (
    <div className="relative" ref={container_ref}>
      {/* Tags visible when collapsed */}
      <ul onClick={() => set_opened(!opened)} className="flex flex-row gap-2 bg-neutral-100 border border-neutral-300 rounded-full px-4 py-1 h-9">
        {!selected_items.length &&
          <span className="text-sm text-neutral-500 my-auto">{placeholder}</span>}

        {selected_items.slice(0, max_visible_).map(item => (
          <li key={item.key} className="border border-neutral-400 bg-neutral-200 px-2 py-1 text-xs rounded-full">
            {item.value}
          </li>
        ))}

        {selected_items.length > max_visible_ && (
          <li className="border border-neutral-400 bg-neutral-200 px-2 py-1 text-xs rounded-full relative group">
            + {selected_items.length - max_visible_}
            <div className="hidden group-hover:block absolute bottom-8 w-50 left-1/2 -translate-x-1/2 bg-neutral-600 text-white rounded px-2 py-1 border border-neutral-800">
              {selected_items.map(item => item.value).slice(max_visible_).join(", ")}
            </div>
          </li>
        )}

        <button className="ml-auto cursor-pointer z-10">
          <i className={`fas ${opened ? "fa-chevron-up" : "fa-chevron-down"}`}></i>
        </button>
      </ul>

      {/* Menu when not collapsed */}
      <ul className={`${opened ? "block" : "hidden"} absolute top-10 w-max bg-white z-10 rounded border border-neutral-300 px-2 py-1`}>
        {options.map(option => (
          has_label(option)
            ? (<Fragment key={option.label}>
                <strong key={option.label}>{option.label}</strong>
                {option.values.map(suboption => (
                  <li className="ml-2 flex flex-row gap-2" key={suboption.key}>
                    <input
                      className="my-auto"
                      checked={!!selected_items.find(item => item.key === suboption.key)}
                      onChange={e => checkbox_changed(e, suboption.key)}
                      type="checkbox"
                      id={suboption.key} />
                    <label htmlFor={suboption.key}>{suboption.value}</label>
                  </li>
                ))}
              </Fragment>)
            : (<li className="ml-2 flex flex-row gap-2" key={option.key}>
                <input
                  className="my-auto"
                  checked={!!selected_items.find(item => item.key === option.key)}
                  onChange={e => checkbox_changed(e, option.key)}
                  type="checkbox"
                  id={option.key} />
                <label htmlFor={option.key}>{option.value}</label>
              </li>)
        ))}
      </ul>
    </div>
  );
}