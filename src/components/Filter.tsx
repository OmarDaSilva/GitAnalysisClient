import { Select } from "@mantine/core";

export default function Filter() {
  return (
    <div className="p-3 grid grid-cols-2 gap-3">
      <div className="bg-a">
        <Select
          placeholder="Exc/Inc Files"
          data={[
            { value: "react", label: "React" },
            { value: "ng", label: "Angular" },
            { value: "svelte", label: "Svelte" },
            { value: "vue", label: "Vue" },
            { value: "None", label: "None" },
          ]}
        />
      </div>
      <div>
        <Select
          placeholder="Developer Filter"
          data={[
            { value: "react", label: "React" },
            { value: "ng", label: "Angular" },
            { value: "svelte", label: "Svelte" },
            { value: "vue", label: "Vue" },
            { value: "None", label: "None" },
          ]}
        />
      </div>
    </div>
  );
}
