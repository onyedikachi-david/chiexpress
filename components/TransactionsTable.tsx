import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn, formatAmount, getTransactionStatus } from "@/lib/utils"



const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">New balance</TableHead>
          <TableHead className="px-2">Balance before</TableHead>
          <TableHead className="px-2 max-md:hidden">Description</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t: Transaction) => {
          const status = getTransactionStatus(new Date(t.date))
          const amount = formatAmount(t.amount)
          const isDebit = t.amount < 0;
          const isCredit = t.amount > 0;

          return (
            <TableRow key={t.meta.issueID} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {t.meta.issueID}
                  </h1>
                </div>
              </TableCell>

              <TableCell className={`pl-2 pr-10 font-semibold ${isDebit || amount[0] === '-' ?
                'text-[#f04438]'
                : 'text-[#039855]'
                }`}>
                {t.amount}
              </TableCell>

              <TableCell className="pl-2 pr-10">
                {t.newBalance}
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {t.balanceBefore}
              </TableCell>

              <TableCell className="pl-2 pr-10 capitalize min-w-24">
                {t.description}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable