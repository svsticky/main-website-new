import { useStore } from "@nanostores/react";
import { programme_filter, type_filter } from "./store";

declare const vacancies: any[];

export function Overview() {
  const selected_programmes = useStore(programme_filter);
  const selected_types = useStore(type_filter);
  const filtered_vacancies = vacancies
    .filter(vacancy => 
      selected_programmes.length
        ? vacancy.content.studies.some(study => selected_programmes.includes(study))
        : true
    ).filter(vacancy =>
      selected_types.length
        ? vacancy.content.type.some(type => selected_types.includes(type))
        : true
    );

  return (
    <ul className="grid grid-cols-4 gap-4">
      {filtered_vacancies.map(vacancy =>
        <a href={`/carriere/vacatures/${vacancy.slug}`}>
          <li className="flex flex-col w-full h-full border border-neutral-200">
            <img className="w-full h-auto" src={vacancy.content.partner[0].content.logo.filename} />
            <span className="font-bold text-lg">{vacancy.content.name}</span>
            <p>{vacancy.content.short_text}</p>
          </li>
        </a>
      )}
    </ul>
  );
}