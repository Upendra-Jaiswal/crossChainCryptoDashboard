import React, { useMemo,useEffect } from 'react';
import { useWallet } from 'use-wallet';


import styled from 'styled-components';
import Spacer from '../../components/Spacer';

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


import useRedeemOnBoardroom from '../../hooks/useRedeemOnBoardroom';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useFetchBoardroomAPR from '../../hooks/useFetchBoardroomAPR';

import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import useWithdrawCheck from '../../hooks/boardroom/useWithdrawCheck';

import { createGlobalStyle } from 'styled-components';


import HomeImage from '../../assets/img/background.jpg';






import useBank from '../../hooks/useBank';
import useStatsForPool from '../../hooks/useStatsForPool';
import useRedeem from '../../hooks/useRedeem';
import {useParams} from 'react-router-dom';





const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;



const useStyles = makeStyles((theme) => ({
    gridItem: {
      height: '100%',
      [theme.breakpoints.up('md')]: {
        height: '90px',
      },
    },
  }));

//   const theme = createTheme({
//     palette: {
//       primary: '#blue',
//     },
//   });

  const cardStyle = {
    display: 'block',
    width: '54vw',
    transitionDuration: '0.3s',
    height: '20vw',
    backgroundColor: "#black"
}




  const Dashboard = () => {

    const classes = useStyles();
    const { account } = useWallet();
    const { onRedeem } = useRedeemOnBoardroom();
    const stakedBalance = useStakedBalanceOnBoardroom();
    const currentEpoch = useCurrentEpoch();
    const cashStat = useCashPriceInEstimatedTWAP();
    const totalStaked = useTotalStakedOnBoardroom();
    const boardroomAPR = useFetchBoardroomAPR();
    const canClaimReward = useClaimRewardCheck();
    const canWithdraw = useWithdrawCheck();
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
  const {bankId} = useParams();
  const bank = useBank(bankId);
  let statsOnPool = useStatsForPool(bank);





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

        <Typography> Daily APR { statsOnPool?.dailyAPR}%</Typography>
      <Typography> TVL ${statsOnPool?.TVL}</Typography>
      </CardContent>
   
    </Card>

          </Grid>

  <Grid item xs={8} >

<Card style={cardStyle}>
      
     
<Typography>{getDisplayBalance(totalStaked)}</Typography>
       <Typography></Typography> 
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
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
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
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
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
          Lizard
        </Typography>
        <Typography variant="body2" color="text.secondary">
      Current price  {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}

     Last-Hour TWAP Price
               
        </Typography>

      </CardContent>
   
    </Card>

  </Grid>
</Grid>









        </Page>

    );
  };



// const StyledBond = styled.div`
// display: flex;
// @media (max-width: 768px) {
//   width: 100%;
//   flex-flow: column nowrap;
//   align-items: center;
// }
// `;

// const StyledCardWrapper = styled.div`
// display: flex;
// flex: 1;
// flex-direction: column;
// @media (max-width: 768px) {
//   width: 80%;
// }
// `;

// const StyledStatsWrapper = styled.div`
// display: flex;
// flex: 0.8;
// margin: 0 20px;
// flex-direction: column;

// @media (max-width: 768px) {
//   width: 80%;
//   margin: 16px 0;
// }
// `;


export default Dashboard;