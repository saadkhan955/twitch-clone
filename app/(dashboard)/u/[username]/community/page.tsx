import { getBlockedUsers } from "@/lib/block-service";

import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { format } from "date-fns";



const CommunityPage = async () => {
  const blockedUser = await getBlockedUsers();
  const formattedData = blockedUser.map((block) => ({
    ...block,
    userId: block.blocked.id,
    imgUrl: block.blocked.imgUrl,
    username: block.blocked.username,
    createdAt: format(new Date(block.blocked.createdAt), "dd/MM/yyyy")
  }))

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">
          Community settings
        </h1>
      </div>
      <DataTable columns={columns} data={formattedData} />
    </div>
  );
}

export default CommunityPage;