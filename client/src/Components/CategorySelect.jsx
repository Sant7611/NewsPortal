import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

export default function CategorySelect({ value, onChange, options }) {
    const selected = options.find((o) => o._id === value);

    return (
        <Listbox value={value} onChange={onChange}>
            <div className="relative">
                <Listbox.Button className="w-full border rounded-md p-2 flex justify-between items-center">
                    <span>{selected?.categoryName || "Select Category"}</span>
                    <ChevronUpDownIcon className="h-5 w-5 text-gray-500" />
                </Listbox.Button>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {options.map((opt) => (
                            <Listbox.Option
                                key={opt._id}
                                value={opt._id}
                                className={({ active }) =>
                                    `cursor-pointer select-none p-2 ${active ? "bg-gray-100" : ""
                                    }`
                                }
                            >
                                {opt.categoryName}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
}
