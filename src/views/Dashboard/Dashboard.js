import React, { useMemo,useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';
 import CardMedia from '@mui/material/CardMedia';
import Page from '../../components/Page';
// for bomb price share price
import useBombStats from '../../hooks/useBombStats';
import useBtcStats from '../../hooks/useBtcStats';
import useShareStats from '../../hooks/usebShareStats';
import {roundAndFormatNumber} from '../../0x';

//nextand current epoch
import ProgressCountdown from './components/ProgressCountdown';
import moment from 'moment';

//current bond price
import useBondStats from '../../hooks/useBondStats';
//last hour twap price
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';

//boardroom
//import Stake from '../Boardroom/components/Stake';
//import Stake from '../Bank/components/Stake';
import Stake from './components/Stake';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useBanks from '../../hooks/useBanks';
//btcb stake
import Value from '../../components/Value';
import useStakedBalance from '../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../hooks/useStakedTokenPriceInDollars';

//btcb earning
import useEarnings from '../../hooks/useEarnings';

//redeembomb
//import SupplyBomb from '../Supply/components/SupplyBomb';
import useRedeemFromBomb from '../../hooks/useRedeemFromBomb';

//depositmodal for broadroom
import DepositModal from '../Boardroom/components/DepositModal';
import useTokenBalance from '../../hooks/useTokenBalance';
import useModal from '../../hooks/useModal';
import useBombFinance from '../../hooks/useBombFinance';
import WithdrawModal from './components/WithdrawModal';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
//claim reward on boardroom
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import handleBuyBonds from  '../Bond/Bond'
import  isBondPurchasable from '../Bond/Bond';



const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;


  const cardStyle = {
    display: 'block',
    width: '54vw',
    transitionDuration: '0.3s',
    height: '20vw',
    backgroundColor: "#black"
}

const Dashboard = () => {

    const { account } = useWallet();
    const currentEpoch = useCurrentEpoch();
    const cashStat = useCashPriceInEstimatedTWAP();
    const totalStaked = useTotalStakedOnBoardroom();
    const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
    const { to } = useTreasuryAllocationTimes();

  // for share price bomb price
  const bombStats = useBombStats();
  const btcStats = useBtcStats();
  const shareStats = useShareStats();

  //current bond price
  const bondStat = useBondStats();
  //last hour twap price

  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 

  //tvl
  useEffect(() => window.scrollTo(0, 0));

//for tvl,daily returns %, stakes, earned rewards, we have to do the following
const [banks] = useBanks()
const btcb = useBank(banks[2].contract);
const bsharebnb = useBank(banks[4].contract);
const bombBSHARE = useBank(banks[5].contract);
let btcbpool = useStatsForPool(btcb);
let bnbpool = useStatsForPool(bsharebnb);
let bombpool = useStatsForPool(bombBSHARE);

console.log(banks);

//depostmodal boardroom 

const bombFinance = useBombFinance();
const stakedBalance = useTokenBalance(bombFinance.BSHARE);
const tokenBalance = useTokenBalance(bombFinance.BSHARE);
//claim reward of bshare in bomb farms section
const {onReward} = useHarvestFromBoardroom();

//redeem bomb
const { onWithdraw } = useRedeemFromBomb();


const stakedBalanceBTCB = useStakedBalance(banks[2].contract,banks[2].poolId);
const stakedTokenPriceInDollarsBTCB = useStakedTokenPriceInDollars(banks[2].depositTokenName, banks[2].depositToken);
const tokenPriceInDollarsStackBTCB = useMemo(
  () => (stakedTokenPriceInDollarsBTCB ? stakedTokenPriceInDollarsBTCB : null),
  [stakedTokenPriceInDollarsBTCB],
);
const earnedInDollarsBTCBStacked = (
  Number(tokenPriceInDollarsStackBTCB) * Number(getDisplayBalance(stakedBalanceBTCB, banks[2].depositToken.decimal))
).toFixed(2);


const stakedBalanceBNB = useStakedBalance(banks[4].contract,banks[4].poolId);
const stakedTokenPriceInDollarsBNB = useStakedTokenPriceInDollars(banks[4].depositTokenName, banks[4].depositToken);
const tokenPriceInDollarsStackBNB = useMemo(
  () => (stakedTokenPriceInDollarsBNB ? stakedTokenPriceInDollarsBNB : null),
  [stakedTokenPriceInDollarsBNB],
);
const earnedInDollarsBNBStacked= (
  Number(tokenPriceInDollarsStackBNB) * Number(getDisplayBalance(stakedBalanceBNB, banks[4].depositToken.decimal))
).toFixed(2);



//EARNED BTCB
const earningsBTCB = useEarnings(banks[2].contract, banks[2].earnTokenName, banks[2].poolId);
//earned btcb in dollar
const bombStatsBTCB = useBombStats();
const tShareStats = useShareStats();
const tokenStatsBTCB = banks[2].earnTokenName === 'BSHARE' ? tShareStats : bombStatsBTCB;
const tokenPriceInDollarsHarvestBTCB = useMemo(
  () => (tokenStatsBTCB ? Number(tokenStatsBTCB.priceInDollars).toFixed(2) : null),
  [tokenStatsBTCB],
);
const earnedInDollarsBTCB = (Number(tokenPriceInDollarsHarvestBTCB) * Number(getDisplayBalance(earningsBTCB))).toFixed(2);

//earned bnb

//EARNED BTCB
const earningsBNB = useEarnings(banks[4].contract, banks[4].earnTokenName, banks[2].poolId);
//earned btcb in dollar

const tokenStatsBNB = banks[4].earnTokenName === 'BSHARE' ? tShareStats : bombStatsBTCB;
const tokenPriceInDollarsHarvestBNB = useMemo(
  () => (tokenStatsBNB ? Number(tokenStatsBNB.priceInDollars).toFixed(2) : null),
  [tokenStatsBNB],
);
const earnedInDollarsBNB = (Number(tokenPriceInDollarsHarvestBNB) * Number(getDisplayBalance(earningsBTCB))).toFixed(2);


    //for  btc price bomb price sgare price
const btcPriceInDollars = useMemo(() => (btcStats ? Number(btcStats).toFixed(2) : null), [btcStats]);
const bombPriceInDollars = useMemo(
  () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
  [bombStats],
);
const sharePriceInDollars = useMemo(
  () => (shareStats ? Number(shareStats.priceInDollars).toFixed(2) : null),
  [shareStats],
);


//withdraw and deposit(stake)from boardroom
const {onStake} = useStakeToBoardroom();




const [onPresentDeposit, onDismissDeposit] = useModal(
  <DepositModal
    max={tokenBalance}
    onConfirm={(value) => {
      onStake(value);
      onDismissDeposit();
    }}
    tokenName={'BSHARE'}
  />,
);

const [onPresentWithdraw, onDismissWithdraw] = useModal(
  <WithdrawModal
    max={stakedBalance}
    onConfirm={(value) => {
      onWithdraw(value);
      onDismissWithdraw();
    }}
    tokenName={'BSHARE'}
  />,
);


    return (
    <Page>
        <BackgroundImage />

    
<Grid container spacing={3}>
    <Grid item xs={9}>
          <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        <div className="navTokenIcon bomb"></div>{' '}
              <div className="navTokenPrice">Bomb price ${roundAndFormatNumber(Number(bombPriceInDollars), 2)}</div>
              <div className="navTokenIcon bshare"></div>{' '}
              <div className="navTokenPrice"> share price ${roundAndFormatNumber(Number(sharePriceInDollars), 2)}</div>
              <div className="navTokenIcon btc"></div>{' '}
              <div className="navTokenPrice"> bond price ${roundAndFormatNumber(Number(btcPriceInDollars), 2)}</div>
        </Typography>
        <Typography variant="body2" color="text.secondary">
     
        </Typography>
      </CardContent>
   
    </Card>

          </Grid>
          <Grid item xs={3}>
          <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        <Typography>Current Epoch {Number(currentEpoch)}</Typography>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Next Epoch in
        <ProgressCountdown base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
        </Typography>
        <Typography> Live TWap  {scalingFactor} BTC</Typography>
        <Typography> Last hour twap price {bondScale || '-'}</Typography>

      </CardContent>
   
    </Card>

          </Grid>

  <Grid item xs={8} >

<Card style={cardStyle}>
      
     
<Typography>total staked {getDisplayBalance(totalStaked)}</Typography>
       <Typography>Board room</Typography> 
       <Typography>

TVL = ${bombpool?.TVL}
Daily returns = ${bombpool?.dailyAPR}
       {!!account ? (
            <Box mt={4}>

                    <Stake />
                    <Harvest />
            </Box>
        ) : (
            <UnlockWallet />
        )}
       </Typography>
       <Typography> <Button onClick={onPresentDeposit}>deposit Button</Button></Typography>
  <Typography> <Button onClick={onPresentWithdraw}>withdrawButton</Button></Typography>
  <Typography> <Button onClick={onReward}> Claim Reward</Button></Typography>
               
</Card>

  </Grid>
  

  <Grid item xs={4} >
 <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
     <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        Lizards
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Advertisement
        </Typography>
      </CardContent>

    </Card>

  </Grid> <Grid item xs={12} >
 <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
         
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Bomb farms
        </Typography>
    
           <Typography>Bomb-BTCB</Typography>
                  <Typography>  TVL ${btcbpool?.TVL}</Typography>
        <Typography>Daily APR</Typography>
                <Typography>{btcbpool?.dailyAPR}%</Typography>
                <Typography>your stake of btcb
                <Value value={getDisplayBalance(stakedBalanceBTCB, banks[2].depositToken.decimal)} /> </Typography>
                <Typography>IN DOLLARS  {`≈ $${earnedInDollarsBTCBStacked}`}</Typography>

                <Typography>earned  IN BTCB Harvest</Typography>
        <Typography>     
           {getDisplayBalance(earningsBTCB)} 
               in dollars {`≈ $${earnedInDollarsBTCB}`}
               </Typography>  
               
               <Typography><Button onClick={onReward}>Claim Reward of bshare</Button></Typography>

                {/* <Typography>earned total <Harvest bank={bank} /> </Typography> */}
                <Typography>BSHARE-BNB</Typography>
                  <Typography>  TVL ${bnbpool?.TVL}</Typography>
        <Typography>Daily APR</Typography>
                <Typography>{bnbpool?.dailyAPR}%</Typography>  
                <Typography>your stake of BNB
                 </Typography>  
                <Typography> 
               <Value value={getDisplayBalance(stakedBalanceBNB, banks[4].depositToken.decimal)} /> 
                  {`≈ $${earnedInDollarsBNBStacked}`}
                </Typography> 
                <Typography>earned Harvest IN BNB</Typography>
   <Typography>     
           {getDisplayBalance(earningsBNB)} 
               in dollars {`≈ $${earnedInDollarsBNB}`}
               </Typography>  
               <Typography><Button onClick={onReward}>Claim Reward of bshare</Button></Typography>
      </CardContent>

    </Card>

  </Grid> <Grid item xs={12} >
 <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        sx={{ height: 140 }}
        image="/static/images/cards/contemplative-reptile.jpg"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
         Bomb
        </Typography>
        <Typography variant="body2" color="text.secondary">
      Current price  {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}

     Last-Hour TWAP Price
               Bonds

               <Button onClick = {onWithdraw} > redeem bomb</Button>

                 {!isBondPurchasable ? 'BOMB is over peg' : 'avaialable for purcahse'}
                
                 {!isBondPurchasable ? (
         <Button disabled>Purchase </Button>
      ) : (
        <Button onClick={handleBuyBonds}>Purchase</Button>
      )}
  
               
        </Typography>

      </CardContent>
   
    </Card>
   
  </Grid>
</Grid>


        </Page>

    );
  };





export default Dashboard;