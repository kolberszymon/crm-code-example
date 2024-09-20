import { MainComponentTransparent } from "@/components/MainComponentTransparent";
import AdminLayout from "@/components/Layouts/AdminLayout";
import TokenBalance from "@/components/pages/dashboard/TokenBalance";
import { TransactionsToSend } from "@/components/pages/dashboard/TransactionsToSend";
import { TransactionsEmployeesMerchants } from "@/components/pages/dashboard/TransactionsEmployeesMerchants";
import { TokenFlowChart } from "@/components/pages/dashboard/TokenFlowChart";
import { MerchantNumberChart } from "@/components/pages/dashboard/MerchantNumberChart";


export default function Home() {
  return (
    <AdminLayout path={["Dashboard"]}>
      <MainComponentTransparent>
        {/* Top side of dashboard */}
        <div className="flex flex-row gap-[25px]">
          {/* Top Left Chart */}
          <div className="flex-1 min-h-[300px]">
           <TokenFlowChart />
          </div>
          {/* Token Balance & Transactions To Be Completed */}
          <div className="flex flex-col min-w-[350px] justify-between">
            <TokenBalance />
            <TransactionsToSend />
          </div>
        </div>

        {/* Bottom side of dashboard */}
        <div className="flex flex-row gap-[25px] mt-10">
          {/* Top Left Chart */}
          <div className="flex-1 min-h-[300px]">
            <MerchantNumberChart />
          </div>          
          <TransactionsEmployeesMerchants />
        </div>
      </MainComponentTransparent>
    </AdminLayout>
  );
}
