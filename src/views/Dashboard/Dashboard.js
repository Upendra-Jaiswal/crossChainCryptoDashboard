import React, { useMemo } from 'react';
import { useWallet } from 'use-wallet';
import moment from 'moment';
import styled from 'styled-components';
import Spacer from '../../components/Spacer';
// import Harvest from './components/Harvest';
// import Stake from './components/Stake';
import { makeStyles } from '@material-ui/core/styles';
import ExchangeCard from './components/ExchangeCard';
import ExchangeStat from './components/ExchangeStat';
import style from "./components/style.css";
import { Box, Card, CardContent, Button, Typography, Grid } from '@material-ui/core';
// import Card from '@mui/material/Card';
// import CardHeader from '@mui/material/CardHeader';
 import CardMedia from '@mui/material/CardMedia';
 import CardActions from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
// import { ThemeProvider } from 'styled-components';
// import { createTheme, maxHeight } from '@mui/system';
// import { Alert } from '@material-ui/lab';

import UnlockWallet from '../../components/UnlockWallet';
import Page from '../../components/Page';

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
//import ProgressCountdown from './components/ProgressCountdown';
import { createGlobalStyle } from 'styled-components';
import { Helmet } from 'react-helmet';

import HomeImage from '../../assets/img/background.jpg';
import {Title, Style} from '@material-ui/icons';
import { black } from '../../theme/colors';
//import { Typography } from '@material-ui/core';

// import {Dashboard} from '@material-ui/icons';

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

//   const cardStyle = {
//     display: 'block',
//     width: '50vw',
//     transitionDuration: '0.3s',
//     height: '20vw',
//     backgroundColor: "#black"
// }



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

    console.log(getDisplayBalance(totalStaked))

    return (
    <Page>
        <BackgroundImage />
  {/* <Typography>{getDisplayBalance(totalStaked)}</Typography> */}
        {/* <Card  style={cardStyle}> */}

       






        </Page>

    );
  };



const StyledBond = styled.div`
display: flex;
@media (max-width: 768px) {
  width: 100%;
  flex-flow: column nowrap;
  align-items: center;
}
`;

const StyledCardWrapper = styled.div`
display: flex;
flex: 1;
flex-direction: column;
@media (max-width: 768px) {
  width: 80%;
}
`;

const StyledStatsWrapper = styled.div`
display: flex;
flex: 0.8;
margin: 0 20px;
flex-direction: column;

@media (max-width: 768px) {
  width: 80%;
  margin: 16px 0;
}
`;
  

export default Dashboard;