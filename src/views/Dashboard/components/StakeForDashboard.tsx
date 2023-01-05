import React, { useMemo, useContext } from 'react';
import { Typography } from '@material-ui/core';
import Value from '../../../components/Value';
import useStakedBalance from '../../../hooks/useStakedBalance';
import useStakedTokenPriceInDollars from '../../../hooks/useStakedTokenPriceInDollars';
import { getDisplayBalance } from '../../../utils/formatBalance';
import TokenSymbol from '../../../components/TokenSymbol';

const StakeForDashboard = ({ stackData }) => {
  const stakedBalance = useStakedBalance(stackData.contract, stackData.poolId);
  const stakedTokenPriceInDollars = useStakedTokenPriceInDollars(stackData.depositTokenName, stackData.depositToken);
  const tokenPriceInDollars = useMemo(
    () => (stakedTokenPriceInDollars ? stakedTokenPriceInDollars : null),
    [stakedTokenPriceInDollars],
  );
  const earnedInDollars = (
    Number(tokenPriceInDollars) * Number(getDisplayBalance(stakedBalance, stackData.depositToken.decimal))
  ).toFixed(2);

  //console.log(bank);
  return (
    <div>
      <TokenSymbol symbol={stackData.depositToken.symbol} size={54} />

      <Value value={getDisplayBalance(stakedBalance, stackData.depositToken.decimal)} />

      <Typography style={{ textTransform: 'uppercase', color: '#fffff' }}>{`≈ $${earnedInDollars}`}</Typography>
    </div>
  );
};

export default StakeForDashboard;
