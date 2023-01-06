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
import UnlockWallet from '../../components/UnlockWallet';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useCashPriceInEstimatedTWAP from '../../hooks/useCashPriceInEstimatedTWAP';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import { createGlobalStyle } from 'styled-components';
import HomeImage from '../../assets/img/background.jpg';
import useStatsForPool from '../../hooks/useStatsForPool';
import useBank from '../../hooks/useBank';
import useBanks from '../../hooks/useBanks';
import useBombFinance from '../../hooks/useBombFinance';
import DataTable from 'react-data-table-component';
import useApprove, { ApprovalState } from '../../hooks/useApprove';
import { useTransactionAdder } from '../../state/transactions/hooks';
import { BOND_REDEEM_PRICE, BOND_REDEEM_PRICE_BN } from '../../bomb-finance/constants';
import ModalHelper from './components/ModalHelper';
import StakeForDashboard from './components/StakeForDashboard';
import HarvestForDashboard from './components/HarvestForDashboard';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import { getDisplayBalance } from '../../utils/formatBalance';

const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage}) repeat !important;
    background-size: cover !important;
    background-color: #171923; 
  }
`;

const Dashboard = () => {
  const { account } = useWallet();
  const currentEpoch = useCurrentEpoch();
  const cashStat = useCashPriceInEstimatedTWAP();

  const scalingFactor = useMemo(() => (cashStat ? Number(cashStat.priceInDollars).toFixed(4) : null), [cashStat]);
  const { to } = useTreasuryAllocationTimes();
  const addTransaction = useTransactionAdder();
  // for price and supply
  const bombStats = useBombStats();
  const btcStats = useBtcStats();
  const shareStats = useShareStats();
  const bondStat = useBondStats();

  //last hour twap price
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4);

  //for tvl,daily returns %, stakes, earned rewards, we have to do the following
  const [banks] = useBanks();

  const newData = banks.filter(
    (finalData) =>
      finalData.depositTokenName === 'BOMB-BSHARE-LP' ||
      finalData.depositTokenName === 'BOMB-BTCB-LP' ||
      finalData.depositTokenName === 'BSHARE-BNB-LP',
  );

  const StackFilter = banks.filter(
    (stackData) =>
      stackData.depositTokenName === 'BOMB-BSHARE-LP' ||
      stackData.depositTokenName === 'BOMB-BTCB-LP' ||
      stackData.depositTokenName === 'BSHARE-BNB-LP',
  );

  const HarvestFilter = banks.filter(
    (harvestData) =>
      harvestData.depositTokenName === 'BOMB-BSHARE-LP' || harvestData.depositTokenName === 'BSHARE-BNB-LP',
  );

  const DailyReturnsBombSHARE = banks.find((aprData) => aprData.depositTokenName === 'BOMB-BSHARE-LP');

  const DailyReturnsBombBTCB = banks.find((aprData) => aprData.depositTokenName === 'BOMB-BTCB-LP');
  const DailyReturnsShareBNB = banks.find((aprData) => aprData.depositTokenName === 'BSHARE-BNB-LP');

  let statAprBombSHARE = useStatsForPool(DailyReturnsBombSHARE);
  let statAprBombBTCB = useStatsForPool(DailyReturnsBombBTCB);
  let statAprBhareBNB = useStatsForPool(DailyReturnsShareBNB);

  const [approveStatus, approve] = useApprove(banks[7].depositToken, banks[7].address);

  const bombFinance = useBombFinance();

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
  ]);
  // console.log(HarvestFilter);

  const column = [
    { name: ' ', selector: 'Currency' },
    { name: 'currentsupply', selector: 'currentsupply' },
    { name: 'totalsupply', selector: 'totalsupply' },
    { name: 'price', selector: 'price' },
  ];

  const classes = useStyles();
  const isBondPurchasable = useMemo(() => Number(bondStat?.tokenInFtm) < 1.01, [bondStat]);
  const isBondRedeemable = useMemo(() => cashPrice.gt(BOND_REDEEM_PRICE_BN), [cashPrice]);

  const totalStaked = useTotalStakedOnBoardroom();

  const handleRedeemBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.redeemBonds(amount);
      addTransaction(tx, { summary: `Redeem ${amount} BBOND` });
    },
    [bombFinance, addTransaction],
  );
  const handleBuyBonds = useCallback(
    async (amount: string) => {
      const tx = await bombFinance.buyBonds(amount);
      addTransaction(tx, {
        summary: `Buy ${Number(amount).toFixed(2)} BBOND with ${amount} BOMB`,
      });
    },
    [bombFinance, addTransaction],
  );

  return (
    <Page>
      <BackgroundImage />

      <Grid container spacing={3} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Grid item xs={12} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
          <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} sx={{ maxWidth: 345 }}>
            <CardContent>
              <center> BOMB FINANCE SUMMARY </center>

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
                  <div className={`${classes.contentBesideSub}`}>TVL ${statAprBombSHARE?.TVL}</div>
                </div>
              }
            />
            <CardContent className={classes.content}>
              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                <div> </div> Daily returns <br />
                {statAprBombSHARE?.dailyAPR}%
              </div>
              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                <div>
                  {' '}
                  Your Stake{' '}
                  {!!account ? (
                    <div>
                      {StackFilter.filter((stackData) => stackData.depositTokenName === 'BOMB-BSHARE-LP').map(
                        (stackData) => (
                          <React.Fragment key={stackData.name}>
                            <StakeForDashboard stackData={stackData} />
                          </React.Fragment>
                        ),
                      )}
                    </div>
                  ) : (
                    <UnlockWallet />
                  )}
                </div>
              </div>
              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                <Typography>Earned</Typography>
                {!!account ? (
                  <div>
                    {HarvestFilter.filter((harvestData) => harvestData.depositTokenName === 'BOMB-BSHARE-LP').map(
                      (harvestData) => (
                        <React.Fragment key={harvestData.name}>
                          <HarvestForDashboard harvestData={harvestData} />
                        </React.Fragment>
                      ),
                    )}
                  </div>
                ) : (
                  <UnlockWallet />
                )}
              </div>

              <div className={`${classes.contentItemBoard} ${classes.textContent}`}>
                <Typography>
                  <div>
                    Total Staked
                    {!!account ? <div> {getDisplayBalance(totalStaked)}</div> : <UnlockWallet />}
                  </div>
                  <div>
                    {newData
                      .filter((finalData) => finalData.depositTokenName === 'BOMB-BSHARE-LP')
                      .map((finalData) => (
                        <React.Fragment key={finalData.name}>
                          <ModalHelper finalData={finalData} />
                        </React.Fragment>
                      ))}
                  </div>
                </Typography>
                <br />
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
                    <Typography> TVL ${statAprBombBTCB?.TVL}</Typography>
                  </div>
                </div>
              }
            />
            <CardContent className={classes.content}>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <div> Daily returns </div>
                <div> {statAprBombBTCB?.dailyAPR} %</div>
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <Row>
                  <Col>
                    <Typography>
                      <div>
                        <Typography>Your Stake</Typography>
                        {!!account ? (
                          <div>
                            {StackFilter.filter((stackData) => stackData.depositTokenName === 'BOMB-BTCB-LP').map(
                              (stackData) => (
                                <React.Fragment key={stackData.name}>
                                  <StakeForDashboard stackData={stackData} />
                                </React.Fragment>
                              ),
                            )}
                          </div>
                        ) : (
                          <UnlockWallet />
                        )}
                      </div>
                    </Typography>
                  </Col>
                  <Col>
                    <div>
                      <Typography>Earned</Typography>

                      {!!account ? (
                        <div>
                          {HarvestFilter.filter((harvestData) => harvestData.depositTokenName === 'BSHARE-BNB-LP').map(
                            (harvestData) => (
                              <React.Fragment key={harvestData.name}>
                                <HarvestForDashboard harvestData={harvestData} />
                              </React.Fragment>
                            ),
                          )}
                        </div>
                      ) : (
                        <UnlockWallet />
                      )}
                    </div>
                  </Col>
                </Row>
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                {newData
                  .filter((finalData) => finalData.depositTokenName === 'BOMB-BTCB-LP')
                  .map((finalData) => (
                    <React.Fragment key={finalData.name}>
                      <ModalHelper finalData={finalData} />
                    </React.Fragment>
                  ))}
              </div>
            </CardContent>
            <CardHeader
              style={{ backgroundColor: 'black' }}
              className={classes.header}
              component={Typography}
              subheader={
                <div className={classes.content}>
                  <div className={`${classes.contentBesideSub}`}> BSHARE-BNB </div>
                  <div className={`${classes.contentBesideSub}`}> </div>
                  <div className={`${classes.contentBesideSub}`}>TVL ${statAprBhareBNB?.TVL}</div>
                </div>
              }
            />
            <CardContent className={classes.content}>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <div> Daily returns</div>
                <div>{statAprBhareBNB?.dailyAPR} %</div>
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                <Row>
                  <Col>
                    <Typography>
                      <div>
                        <Typography>Your Stake</Typography>
                        {!!account ? (
                          <div>
                            {StackFilter.filter((stackData) => stackData.depositTokenName === 'BSHARE-BNB-LP').map(
                              (stackData) => (
                                <React.Fragment key={stackData.name}>
                                  <StakeForDashboard stackData={stackData} />
                                </React.Fragment>
                              ),
                            )}
                          </div>
                        ) : (
                          <UnlockWallet />
                        )}
                      </div>
                    </Typography>{' '}
                  </Col>
                  <Col>
                    <Typography>Earned</Typography>
                    <Typography>
                      {!!account ? (
                        <div>
                          {HarvestFilter.filter((harvestData) => harvestData.depositTokenName === 'BSHARE-BNB-LP').map(
                            (harvestData) => (
                              <React.Fragment key={harvestData.name}>
                                <HarvestForDashboard harvestData={harvestData} />
                              </React.Fragment>
                            ),
                          )}
                        </div>
                      ) : (
                        <UnlockWallet />
                      )}
                    </Typography>
                  </Col>
                </Row>
              </div>
              <div className={`${classes.contentItem} ${classes.textContent}`}>
                {newData
                  .filter((finalData) => finalData.depositTokenName === 'BSHARE-BNB-LP')
                  .map((finalData) => (
                    <React.Fragment key={finalData.name}>
                      <ModalHelper finalData={finalData} />
                    </React.Fragment>
                  ))}
              </div>
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
                      {!!account ? (
                        <div>
                          {approveStatus !== ApprovalState.APPROVED ? (
                            <Button
                              disabled={
                                banks.closedForStaking ||
                                approveStatus === ApprovalState.PENDING ||
                                approveStatus === ApprovalState.UNKNOWN
                              }
                              onClick={handleBuyBonds}
                              variant="contained"
                              style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                            >
                              {`Approve ${banks[7].depositTokenName}`}
                            </Button>
                          ) : (
                            <>
                              <Button disabled>Purchase</Button>
                            </>
                          )}
                        </div>
                      ) : (
                        <UnlockWallet />
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <br />
                    <Col>Redeem BOMB </Col>
                    <Col>
                      {' '}
                      {!!account ? (
                        <Button
                          onClick={handleRedeemBonds}
                          variant="contained"
                          style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                          disabled={!isBondRedeemable}
                        >
                          {!isBondRedeemable ? `Enabled when 10,000 BOMB > ${BOND_REDEEM_PRICE}BTC` : null || 'Redeem'}
                        </Button>
                      ) : (
                        <UnlockWallet />
                      )}
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
