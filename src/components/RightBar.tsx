import { Divider, Drawer, Group, Paper, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export default function RightBar() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <div className="w-1/4 grid grid-rows-2 gap-2">
        <Paper shadow="md" radius="lg" p="xl">
          <div className="bg-Secondary p-3 flex flex-row justify-between ">
            <p className="text-[20px] text-[#495057]">
              Signifcant Events: Merge
            </p>
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

          <Group className="flex justify-center">
            <Button variant="white" onClick={open}>
              Sort Hierarchical Views
            </Button>
          </Group>
        </Paper>

        {/* <Paper shadow="md" radius="lg" p="xl">
        <div className="bg-Secondary p-3 grid grid-row-2 gap-3 justify-between">
          Hierarchical Views
        </div>
        <Divider />
      </Paper> */}
      </div>
      <Drawer opened={opened} onClose={close}>
        <div>Hello</div>
      </Drawer>
    </>
  );
}
