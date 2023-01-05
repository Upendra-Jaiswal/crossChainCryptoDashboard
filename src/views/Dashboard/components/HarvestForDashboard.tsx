import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import Value from '../../../components/Value';
import useEarnings from '../../../hooks/useEarnings';
import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';
import useBombStats from '../../../hooks/useBombStats';
import useShareStats from '../../../hooks/usebShareStats';
import Label from '../../../components/Label';
import useEarningsOnBoardroom from '../../../hooks/useEarningsOnBoardroom';

const HarvestForDashboard = ({ harvestData }) => {
  const earnings = useEarnings(harvestData.contract, harvestData.earnTokenName, harvestData.poolId);

  const bombStats = useBombStats();
  const tShareStats = useShareStats();

  const earningsOnBroadroom = useEarningsOnBoardroom();

  const tokenName = harvestData.earnTokenName === 'BSHARE' ? 'BSHARE' : 'BOMB';
  const tokenStats = harvestData.earnTokenName === 'BSHARE' ? tShareStats : bombStats;
  const tokenPriceInDollars = useMemo(
    () => (tokenStats ? Number(tokenStats.priceInDollars).toFixed(2) : null),
    [tokenStats],
  );

  const tokenPriceInDollarsForBroadroom = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );
  //console.log(bank);
  const earnedInDollarsBroadroom = (
    Number(tokenPriceInDollarsForBroadroom) * Number(getDisplayBalance(earnings))
  ).toFixed(2);

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);
  return (
    <div>
      {!!(harvestData.depositTokenName === 'BOMB-BSHARE-LP') ? (
        <div>
          <TokenSymbol symbol={harvestData.earnToken.symbol} />
          <Value value={getDisplayBalance(earningsOnBroadroom)} />
          <Label text={`≈ $${earnedInDollarsBroadroom}`} variant="yellow" />
          <Label text="BOMB Earned" variant="yellow" />
        </div>
      ) : (
        <div>
          <div>
            <TokenSymbol symbol={harvestData.earnToken.symbol} />
            <Value value={getDisplayBalance(earnings)} />
            <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>{`≈ $${earnedInDollars}`}</Typography>
            {/* <Label text={`≈ $${earnedInDollars}`} /> */}
            <Typography style={{ textTransform: 'uppercase', color: '#f9d749' }}>{`${tokenName} Earned`}</Typography>
          </div>
        </div>
      )}
    </div>
  );
};

export default HarvestForDashboard;
