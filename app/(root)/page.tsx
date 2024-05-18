import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/wallet.actions';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const res = await getLoggedInUser();
  const userId = res["userId"]
  const accounts = await getAccounts({
    userId
  })

  if (!accounts) return;

  const accountsData = accounts?.data;
  const walletId = (id as string) || accountsData[0]?.id;
  console.log(accounts?.totalBalance)
  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={res?.firstName || 'Guest'}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts?.totalWallets}
            totalCurrentBalance={accounts?.totalBalance}
          />
        </header>


        <RecentTransactions
          accounts={accountsData}
          transactions={accountsData?.transactions}
          walletId={walletId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={res}
        transactions={accountsData?.transactions}
        wallets={accountsData?.slice(0, 2)}
      />

    </section>
  )
}

export default Home