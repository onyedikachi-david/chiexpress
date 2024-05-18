import HeaderBox from '@/components/HeaderBox'
import { Pagination } from '@/components/Pagination';
import TransactionsTable from '@/components/TransactionsTable';
import { getAccount, getAccounts } from '@/lib/actions/wallet.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';
import { formatAmount } from '@/lib/utils';
import React from 'react'

const TransactionHistory = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const loggedIn = await getLoggedInUser();
  const accounts = await getAccounts({
    userId: loggedIn.$id
  })

  if (!accounts) return;


  const accountsData = accounts?.data;
  console.log("From transaction history:   ", accountsData[Number(id)])

  // const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;
  const walletId = (id as string) || accountsData[0]?.id;


  const account = await getAccount({ walletId: "kjskds" })


  const rowsPerPage = 10;
  const totalPages = Math.ceil(10 / rowsPerPage);

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

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

  const parsedAccounts = parseTransactionData(accountsData);


  const currentTransactions = parsedAccounts.find(account => account.id === id)?.transactions || [];

  return (
    <div className="transactions">
      <div className="transactions-header">
        <HeaderBox
          title="Transaction History"
          subtext="See your bank details and transactions."
        />
      </div>

      <div className="space-y-6">
        <div className="transactions-account">
          <div className="flex flex-col gap-2">
            {/* <h2 className="text-18 font-bold text-white">{accountsData}</h2> */}
            <p className="text-14 text-blue-25">
              {`${loggedIn.firstName} ${loggedIn.lastName}`}
            </p>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● { }
            </p>
          </div>

          <div className='transactions-account-balance'>
            <p className="text-14">Current balance</p>
            {/* <p className="text-24 text-center font-bold">{formatAmount(accountsData[Number(id)].balance)}</p> */}
          </div>
        </div>

        <section className="flex w-full flex-col gap-6">
          <TransactionsTable
            transactions={currentTransactions}
          />
          {totalPages > 1 && (
            <div className="my-4 w-full">
              <Pagination totalPages={totalPages} page={currentPage} />
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default TransactionHistory