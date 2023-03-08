import { Divider, Paper } from "@mantine/core";

export default function RightBar() {
  return (
    <div className="w-1/4">
      <Paper shadow="md" radius="lg" p="xl">
        <div className="bg-Secondary p-3 flex flex-row justify-between ">
          <p className="text-[20px] text-[#495057]">Signifcant Events: Merge</p>
        </div>
        <Divider />
        <div className="bg-Secondary p-3 flex flex-col justify-between ">
          <p className="text-[20px] text-[#495057] mb-3">File changes</p>
          <div className="bg-Primary">Hello</div>
        </div>
        <Divider />
        <div className="bg-Secondary p-3 flex flex-col justify-between ">
          <p className="text-[20px] text-[#495057] mb-3">Commits </p>
          <div className="bg-Primary">Hello</div>
        </div>
        <Divider />
        <div className="bg-Secondary p-3 flex flex-col justify-between ">
          <p className="text-[20px] text-[#495057] mb-3">Contributors </p>
          <div className="bg-Primary">Hello</div>
        </div>
        <Divider />

      </Paper>
    </div>
  );
}
