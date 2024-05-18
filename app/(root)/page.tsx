import HeaderBox from '@/components/HeaderBox'
import RecentTransactions from '@/components/RecentTransactions';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getAccount, getAccounts } from '@/lib/actions/wallet.actions';
import { getLoggedInUser, getAndSaveWalletDetails } from '@/lib/actions/user.actions';

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;
  const res = await getLoggedInUser();
  const userId = res["userId"]
  const accounts = await getAccounts({
    userId
  })
  // const res = getAndSaveWalletDetails()

  if (!accounts) return;

  const accountsData = accounts?.data;
  const walletId = (id as string) || accountsData[0]?.id;

  const account = await getAccount({ walletId: "jhjdskm" })
  console.log(accounts?.totalBalance)


  // I should be able to call the Wallet document and just save the
  // subAccountId, since it is the only required field.
  // await getAndSaveWalletDetails(responseData.data.id, user.$id);
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

        {/* <RecentTransactions
          accounts={accountsData}
          transactions={account?.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        /> */}

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