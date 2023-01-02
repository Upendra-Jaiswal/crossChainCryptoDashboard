import React, { useMemo, useCallback, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useWallet } from 'use-wallet';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, CardHeader, Button, Typography, Grid } from '@material-ui/core';
import Page from '../../components/Page';
import useBtcStats from '../../hooks/useBtcStats';
import { roundAndFormatNumber } from '../../0x';
//nextand current epoch
import ProgressCountdown from './components/ProgressCountdown';
import moment from 'moment';
//current bond price & supply of BOND
import useBondStats from '../../hooks/useBondStats';
//supply of BSHARE
import useShareStats from '../../hooks/usebShareStats';
//supply of bomb stat & for bomb price share price
import useBombStats from '../../hooks/useBombStats';
//last hour twap price
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
//boardroom
import Stake from './components/Stake';
import UnlockWallet from '../../components/UnlockWallet';
import Harvest from './components/Harvest';
import { getDisplayBalance } from '../../utils/formatBalance';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
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
import isBondPurchasable from '../Bond/Bond';
import DataTable from 'react-data-table-component';
import useApprove, { ApprovalState } from '../../hooks/useApprove';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923;
  }
`;

// const Dashboard : React.FC<StakeProps> = ({ props }) => {
const Dashboard = (props) => {
  const { account } = useWallet();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();
  const totalStaked = useTotalStakedOnBoardroom();
  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();

  // for price and supply
  const bombStats = useBombStats();
  const btcStats = useBtcStats();
  const shareStats = useShareStats();
  const bondStat = useBondStats();

  //last hour twap price
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  //tvl
  useEffect(() => window.scrollTo(0, 0));

  //for tvl,daily returns %, stakes, earned rewards, we have to do the following
  const [banks] = useBanks();
  const btcb = useBank(banks[2].contract);
  const bsharebnb = useBank(banks[4].contract);
  const bombBSHARE = useBank(banks[5].contract);
  let btcbpool = useStatsForPool(btcb);
  let bnbpool = useStatsForPool(bsharebnb);
  let bombpool = useStatsForPool(bombBSHARE);

  const [approvProp, approve] = useApprove(banks[7].depositToken, banks[7].address);

  //depostmodal boardroom
  const bombFinance = useBombFinance();
  const stakedBalance = useTokenBalance(bombFinance.BSHARE);
  const tokenBalance = useTokenBalance(bombFinance.BSHARE);
  const stakedBalLP = useTokenBalance(bombFinance.BOMBBTCB_LP);
  const toeknBalLP = useTokenBalance(bombFinance.BOMBBTCB_LP);

  //claim reward of bshare in bomb farms section
  const { onReward } = useHarvestFromBoardroom();
  //redeem bomb
  const { onWithdraw } = useRedeemFromBomb();

  const stakedBalanceBTCB = useStakedBalance(banks[2].contract, banks[2].poolId);
  const stakedTokenPriceInDollarsBTCB = useStakedTokenPriceInDollars(banks[2].depositTokenName, banks[2].depositToken);
  const tokenPriceInDollarsStackBTCB = useMemo(
    () => (stakedTokenPriceInDollarsBTCB ? stakedTokenPriceInDollarsBTCB : null),
    [stakedTokenPriceInDollarsBTCB],
  );
  const earnedInDollarsBTCBStacked = (
    Number(tokenPriceInDollarsStackBTCB) * Number(getDisplayBalance(stakedBalanceBTCB, banks[2].depositToken.decimal))
  ).toFixed(2);

  const stakedBalanceBNB = useStakedBalance(banks[4].contract, banks[4].poolId);
  const stakedTokenPriceInDollarsBNB = useStakedTokenPriceInDollars(banks[4].depositTokenName, banks[4].depositToken);
  const tokenPriceInDollarsStackBNB = useMemo(
    () => (stakedTokenPriceInDollarsBNB ? stakedTokenPriceInDollarsBNB : null),
    [stakedTokenPriceInDollarsBNB],
  );
  const earnedInDollarsBNBStacked = (
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
  const earnedInDollarsBTCB = (
    Number(tokenPriceInDollarsHarvestBTCB) * Number(getDisplayBalance(earningsBTCB))
  ).toFixed(2);

  //EARNED BNB
  const earningsBNB = useEarnings(banks[4].contract, banks[4].earnTokenName, banks[2].poolId);
  //earned btcb in dollar
  const tokenStatsBNB = banks[4].earnTokenName === 'BSHARE' ? tShareStats : bombStatsBTCB;
  const tokenPriceInDollarsHarvestBNB = useMemo(
    () => (tokenStatsBNB ? Number(tokenStatsBNB.priceInDollars).toFixed(2) : null),
    [tokenStatsBNB],
  );
  const earnedInDollarsBNB = (Number(tokenPriceInDollarsHarvestBNB) * Number(getDisplayBalance(earningsBTCB))).toFixed(
    2,
  );
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
  const { onStake } = useStakeToBoardroom();
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

  const [onPresentDepositLP, onDismissDepositLP] = useModal(
    <DepositModal
      max={toeknBalLP}
      onConfirm={(value) => {
        onStake(value);
        onDismissDepositLP();
      }}
      tokenName={'BOMBBTCB_LP'}
    />,
  );

  const [onPresentWithdrawLP, onDismissWithdrawLP] = useModal(
    <WithdrawModal
      max={stakedBalLP}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdrawLP();
      }}
      tokenName={'BOMBBTCB_LP'}
    />,
  );

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        display: 'flex',
        flexDirection: 'column', //change to row for horizontal layout
        '& .MuiCardHeader-root': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        '& .MuiCardHeader-title': {
          //could also be placed inside header class
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '& .MuiCardHeader-subheader	': {
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
      },
      header: { backgroundColor: 'black' },
      content: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      gridClassName: {
        boxShadow: '20px 40px ',
      },
      contentItem: {
        width: '33%',
      },
      contentItemBoard: {
        width: '25%',
      },
      contentBesideSub: {
        height: '50px',
        width: '33%',
        textAlign: 'center',
      },

      textContent: {
        fontSize: 18,
        textAlign: 'center',
      },
    }),
  );

  const [tableData, setTableData] = useState([
    {
      Currency: '$BOMB',
      currentsupply: Number(bombStats?.circulatingSupply).toFixed(4) || '-',
      totalsupply: Number(bombStats?.totalSupply).toFixed(4) || '-',
    },
    { Currency: '$BSHARE', currentsupply: Number(shareStats?.circulatingSupply).toFixed(4) || '-' },
    { Currency: '$BBOND', currentsupply: Number(bondStat?.circulatingSupply).toFixed(4) || '-' },
  ]);

  useEffect(() => {
    setTableData((prevTableData) => {
      const newTableData = [...prevTableData];

      newTableData[0].currentsupply = Number(bombStats?.circulatingSupply).toFixed(4) || '-';
      newTableData[1].currentsupply = Number(shareStats?.circulatingSupply).toFixed(4) || '-';
      newTableData[2].currentsupply = Number(bondStat?.circulatingSupply).toFixed(4) || '-';
      newTableData[0].totalsupply = Number(bombStats?.totalSupply).toFixed(4) || '-';
      newTableData[1].totalsupply = Number(shareStats?.totalSupply).toFixed(4) || '-';
      newTableData[2].totalsupply = Number(bondStat?.totalSupply).toFixed(4) || '-';
      newTableData[0].price = roundAndFormatNumber(Number(bombPriceInDollars), 2);
      newTableData[1].price = roundAndFormatNumber(Number(sharePriceInDollars), 2);
      newTableData[2].price = roundAndFormatNumber(Number(btcPriceInDollars), 2);

      return newTableData;
    });
  }, [
    bombStats?.circulatingSupply,
    shareStats?.circulatingSupply,
    bondStat?.circulatingSupply,
    bombStats?.totalSupply,
    shareStats?.totalSupply,
    bondStat?.totalSupply,
    bombPriceInDollars,
    sharePriceInDollars,
    btcPriceInDollars,
  ]); // Only re-run the effect when the dependencies change

  const column = [
    { name: ' ', selector: 'Currency' },
    { name: 'currentsupply', selector: 'currentsupply' },
    { name: 'totalsupply', selector: 'totalsupply' },
    { name: 'price', selector: 'price' },
  ];

  const classes = useStyles();

  //console.log(banks[0]);
  return (
    <Page>
      <BackgroundImage />

      <Grid container spacing={3} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Grid item xs={12} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} sx={{ maxWidth: 345 }}>
            <CardContent>
              <center> BOMB FINANCE SUMMARY</center>
              <div style={{ display: 'block', padding: 30 }}>
                <Row>
                  <Col>
                    <div style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.8)' }}>
                      <DataTable columns={column} data={tableData} />
                    </div>
                  </Col>
                  <Col>
                    <div Style="margin-left: 100px;">
                      <Row>
                        <Row>
                          <Typography>
                            Current Epoch
                            <br />
                            {Number(currentEpoch)}
                          </Typography>
                        </Row>
                        <Row>
                          <Typography>
                            Next Epoch in
                            <ProgressCountdown
                              base={moment().toDate()}
                              hideBar={false}
                              deadline={to}
                              description="Next Epoch"
                              size="200%"
                            />
                            <br />
                          </Typography>
                        </Row>
                        <Row>
                          <Typography> Live TWap {scalingFactor} BTC</Typography>
                          <br />
                          <Typography> Last hour twap price {bondScale || '-'}</Typography>
                        </Row>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </CardContent>
          </Card>{' '}
        </Grid>

        <Grid item xs={8} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} className={classes.root}>
            <CardHeader
              style={{ backgroundColor: 'black' }}
              className={classes.header}
              component={Typography}
              title={<Typography>Board room</Typography>}
              subheader={
                <div className={classes.content}>
                  <div className={`${classes.contentBesideSub}`}>Stake BSHARE and earn BOMB every epoch</div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                  <div className={`${classes.contentBesideSub}`}>TVL ${bombpool?.TVL}</div>
                </div>
              }
            />
            <CardContent className={classes.content}>
              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                Daily returns = ${bombpool?.dailyAPR}
              </div>
              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                {!!account ? <Stake /> : <UnlockWallet />}
              </div>
              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                {!!account ? <Harvest /> : <UnlockWallet />}
              </div>

              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                Total Staked: {getDisplayBalance(totalStaked)}
                <Typography>
                  {' '}
                  <Button
                    onClick={onPresentDeposit}
                    variant="contained"
                    style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    deposit Button
                  </Button>
                </Typography>{' '}
                <br />
                <Typography>
                  {' '}
                  <Button
                    onClick={onPresentWithdraw}
                    variant="contained"
                    style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    withdrawButton
                  </Button>
                </Typography>
                <br />
                <Typography>
                  {' '}
                  <Button
                    onClick={onReward}
                    variant="contained"
                    style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                  >
                    {' '}
                    Claim Reward
                  </Button>
                </Typography>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={4} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} sx={{ maxWidth: 345 }}>
            <CardContent>
              <Typography gutterBottom variant="h9" component="div">
                Advertisement
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} className={classes.root}>
            <CardHeader
              style={{ backgroundColor: 'black' }}
              className={classes.header}
              component={Typography}
              title={<Typography>BOMB FARMS</Typography>}
              subheader={
                <div className={classes.content}>
                  <div className={`${classes.contentBesideSub}`}>
                    Stake your LP tokens in our farms to start earning $BSHARE
                  </div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                  <div className={`${classes.contentBesideSub}`}></div>
                </div>
              }
            />

            <CardHeader
              style={{ backgroundColor: 'black' }}
              className={classes.header}
              component={Typography}
              subheader={
                <div className={classes.content}>
                  <div className={`${classes.contentBesideSub}`}>BOMB BTC-B</div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                  <div className={`${classes.contentBesideSub}`}>
                    {' '}
                    <Typography> TVL ${btcbpool?.TVL}</Typography>
                  </div>
                </div>
              }
            />
            <CardContent className={classes.content}>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                Daily returns <Typography>{btcbpool?.dailyAPR}%</Typography>
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                {!!account ? (
                  <Row>
                    <Col>
                      <Typography>
                        Your Stake
                        <Value value={getDisplayBalance(stakedBalanceBTCB, banks[2].depositToken.decimal)} />{' '}
                      </Typography>
                      <Typography>IN DOLLARS {`≈ $${earnedInDollarsBTCBStacked}`}</Typography>
                    </Col>
                    <Col>
                      {' '}
                      <Typography>Earned</Typography>
                      <Typography>
                        <Value value={getDisplayBalance(earningsBTCB)} />{' '}
                      </Typography>
                      <Typography> {`≈ $${earnedInDollarsBTCB}`}</Typography>
                    </Col>
                  </Row>
                ) : (
                  <UnlockWallet />
                )}
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <Row>
                  <Col>
                    {' '}
                    <Typography>
                      {' '}
                      <Button
                        onClick={onPresentDepositLP}
                        variant="contained"
                        style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                      >
                        Deposit
                      </Button>
                    </Typography>
                  </Col>
                  <Col>
                    {' '}
                    <Typography>
                      {' '}
                      <Button
                        onClick={onPresentWithdrawLP}
                        variant="contained"
                        style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                      >
                        Withdraw
                      </Button>
                    </Typography>
                  </Col>
                  <Col>
                    {' '}
                    <Button
                      onClick={onReward}
                      variant="contained"
                      style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                    >
                      Claim Reward
                    </Button>
                  </Col>
                </Row>{' '}
              </div>{' '}
            </CardContent>
            <CardHeader
              style={{ backgroundColor: 'black' }}
              className={classes.header}
              component={Typography}
              subheader={
                <div className={classes.content}>
                  <div className={`${classes.contentBesideSub}`}> BSHARE-BNB </div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                  <div className={`${classes.contentBesideSub}`}>TVL ${bnbpool?.TVL}</div>
                </div>
              }
            />
            <CardContent className={classes.content}>
              <div className={`${classes.contentItem} ${classes.textContent}`}>Daily returns {bnbpool?.dailyAPR}%</div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                {!!account ? (
                  <Row>
                    {' '}
                    <Col>
                      {' '}
                      <Typography>
                        {' '}
                        Your stake <Value value={getDisplayBalance(stakedBalanceBNB, banks[4].depositToken.decimal)} />
                        {`≈ $${earnedInDollarsBNBStacked}`}
                      </Typography>{' '}
                    </Col>
                    <Col>
                      <Typography>Earned</Typography>
                      <Typography>
                        <Value value={getDisplayBalance(earningsBNB)} />
                        {`≈ $${earnedInDollarsBNB}`}
                      </Typography>
                    </Col>{' '}
                  </Row>
                ) : (
                  <UnlockWallet />
                )}{' '}
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <Row>
                  <Col>
                    <Typography>
                      {' '}
                      <Button
                        onClick={onPresentDepositLP}
                        variant="contained"
                        style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                      >
                        Deposit
                      </Button>
                    </Typography>
                  </Col>
                  <Col>
                    <Typography>
                      {' '}
                      <Button
                        onClick={onPresentWithdrawLP}
                        variant="contained"
                        style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                      >
                        Withdraw
                      </Button>
                    </Typography>
                  </Col>
                  <Col>
                    <Button
                      onClick={onReward}
                      variant="contained"
                      style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                    >
                      Claim Reward
                    </Button>
                  </Col>
                </Row>{' '}
              </div>{' '}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Card className={classes.root} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
            <CardHeader
              style={{ backgroundColor: 'black' }}
              className={classes.header}
              component={Typography}
              title={<Typography>BONDS</Typography>}
              subheader={
                <div className={classes.content}>
                  <div className={`${classes.contentBesideSub}`}>
                    BBONDS can only be purchased only on contraction period, when TWAP of BOMB is below 1
                  </div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                </div>
              }
            />

            <CardContent className={classes.content}>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                Current price {Number(bondStat?.tokenInFtm).toFixed(4) || '-'}
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}></div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <Row>
                  <Row>
                    <Col>{!isBondPurchasable ? 'BOMB is over peg' : 'available for purcahse'}</Col>
                    <Col>
                      {approvProp !== ApprovalState.APPROVED ? (
                        <Button
                          disabled={
                            banks.closedForStaking ||
                            approvProp === ApprovalState.PENDING ||
                            approvProp === ApprovalState.UNKNOWN
                          }
                          onClick={approve}
                          variant="contained"
                          style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                        >
                          {`Approve ${banks[7].depositTokenName}`}
                        </Button>
                      ) : (
                        <>
                          <Button onClick={onPresentWithdraw}></Button>

                          <Button
                            disabled={
                              banks.closedForStaking ||
                              banks.depositTokenName === 'BOMB-BSHARE-LP' ||
                              banks.depositTokenName === 'BOMB' ||
                              banks.depositTokenName === 'BOMB-BTCB-LP' ||
                              banks.depositTokenName === '80BOMB-20BTCB-LP' ||
                              banks.depositTokenName === '80BSHARE-20WBNB-LP' ||
                              banks.depositTokenName === 'BUSM-BUSD-LP' ||
                              banks.depositTokenName === 'BBOND'
                            }
                            onClick={() => (banks.closedForStaking ? null : props.data.presentZap())}
                          ></Button>

                          <Button
                            disabled={banks.closedForStaking}
                            onClick={() => (banks.closedForStaking ? null : onPresentDeposit())}
                          ></Button>
                        </>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <br />
                    <Col>Redeem BOMB </Col>
                    <Col>
                      {' '}
                      <Button
                        onClick={onWithdraw}
                        variant="contained"
                        style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                      >
                        redeem bomb
                      </Button>
                    </Col>
                  </Row>
                </Row>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};
export default Dashboard;
