import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BankTabItem } from './BankTabItem'
import BankInfo from './BankInfo'
import TransactionsTable from './TransactionsTable'
import { Pagination } from './Pagination'

const RecentTransactions = ({
  accounts,
  transactions = [],
  walletId,
  page = 1,
}: RecentTransactionsProps) => {
  const rowsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / rowsPerPage);

  const indexOfLastTransaction = page * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  // const currentTransactions = transactions.slice(
  //   indexOfFirstTransaction, indexOfLastTransaction
  // )
  const parseTransactionData = (data) => {
    return data.map(account => ({
      ...account,
      transactions: account.transactions.map(transaction => ({
        ...transaction,
        meta: {
          ...transaction.meta,
          date: new Date(transaction.meta.date._seconds * 1000),
        },
      })),
    }));
  };

  const parsedAccounts = parseTransactionData(accounts);


  const currentTransactions = parsedAccounts.find(account => account.id === walletId)?.transactions || [];


  // console.log()

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${walletId}`} // Replace with wallet type id
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs defaultValue={walletId} className="w-full">
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Wallet) => (
            <TabsTrigger key={account.id} value={account.type}>
              <BankTabItem
                key={account.id}
                account={account}
                walletId={walletId}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Wallet) => (
          <TabsContent
            value={account.type}
            key={account.id}
            className="space-y-4"
          >
            <BankInfo
              account={account}
              walletId={walletId}
              type="full"
            />

            <TransactionsTable transactions={currentTransactions} />


            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}

export default RecentTransactions