import { ConnectButton } from "../components/ConnectButton";
import { Connected } from "../components/Connected";
import { DAOs } from "../components/DAOs";
import { DepositDao } from "../components/DepositDao";

const Page: React.FC = () => {
  return (
    <>
      <h1>Aragon SDK + WAGMI</h1>

      <ConnectButton />

      <Connected>
        <hr />
        <h2>DAOs</h2>
        <DAOs />
        <br />
        <hr />
        <h2>Deposit</h2>
        <DepositDao />
        <br />
        <hr />
      </Connected>
    </>
  );
};

export default Page;
