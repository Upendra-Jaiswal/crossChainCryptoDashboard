import React from 'react';

import useModal from '../../../hooks/useModal';
import useStake from '../../../hooks/useStake';

import useStakedBalance from '../../../hooks/useStakedBalance';
import useTokenBalance from '../../../hooks/useTokenBalance';
import useWithdraw from '../../../hooks/useWithdraw';
import DepositModal from './DepositModal';
import WithdrawModal from './WithdrawModal';
import useHarvest from '../../../hooks/useHarvest';
import useRedeem from '../../../hooks/useRedeem';
import useRedeemOnBoardroom from '../../../hooks/useRedeemOnBoardroom';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import UnlockWallet from '../../../components/UnlockWallet';
import { useWallet } from 'use-wallet';
import { Button, Typography } from '@material-ui/core';

const ModalHelper = ({ finalData }) => {
  const { account } = useWallet();
  const tokenBalance = useTokenBalance(finalData.depositToken);
  const stakedBalance = useStakedBalance(finalData.contract, finalData.poolId);
  //let depositToken = finalData.depositTokenName.toUpperCase();
  const { onStake } = useStake(finalData);
  const { onWithdraw } = useWithdraw(finalData);
  const { onReward } = useHarvest(finalData);

  const { onRedeem } = useRedeemOnBoardroom();
  const { onRedeemBank } = useRedeem(finalData);

  console.log(finalData);
  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      decimals={finalData.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onStake(amount);
        onDismissDeposit();
      }}
      tokenName={finalData.depositTokenName}
    />,
  );
  //console.log(props.finalData);
  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      decimals={finalData.depositToken.decimal}
      onConfirm={(amount) => {
        if (Number(amount) <= 0 || isNaN(Number(amount))) return;
        onWithdraw(amount);
        onDismissWithdraw();
      }}
      tokenName={finalData.depositTokenName}
    />,
  );

  return (
    // <div></div>
    // {/* <>
    //     {/* {!!(finalData.depositTokenName === 'BSHARE-BNB-LP') ?  ( */}
    // <div> */}

    // <div>
    //   <div>
    //     <Row>
    //       <Col>
    //         <Typography>
    //           <Button
    //             onClick={onPresentDeposit}
    //             variant="contained"
    //             style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //           >
    //             Deposit 2
    //           </Button>
    //         </Typography>
    //       </Col>
    //       <Col>
    //         <Typography>
    //           <Button
    //             onClick={onPresentWithdraw}
    //             variant="contained"
    //             style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //           >
    //             Withdraw
    //           </Button>
    //         </Typography>
    //       </Col>
    //       <Col>
    //         <Button onClick={onRedeem} variant="contained" style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}>
    //           Claim Reward
    //         </Button>
    //       </Col>
    //     </Row>
    //   </div>
    // </div>

    // <div>
    //    {!!account ? (
    //   <div>
    //     {!!(finalData.depositTokenName === 'BOMB-BSHARE-LP') ? (
    //       <div>
    //         <div>
    //           <Button
    //             onClick={onPresentDeposit}
    //             variant="contained"
    //             style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //           >
    //             deposit Button1
    //           </Button>
    //         </div>
    //         <br />
    //         <div>
    //           <Typography>
    //             <Button
    //               onClick={onPresentWithdraw}
    //               variant="contained"
    //               style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //             >
    //               withdrawButton
    //             </Button>
    //           </Typography>
    //         </div>

    //         <br />
    //         <div>
    //           <Typography>
    //             <Button
    //               onClick={onRedeemBank}
    //               variant="contained"
    //               style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //             >
    //               Claim Reward
    //             </Button>
    //           </Typography>
    //         </div>
    //       </div>
    //     ) :   (  {!!(finalData.depositTokenName === 'BSHARE-BNB-LP') ?  (
    //       <div>

    //             <div>
    //               <Row>
    //                 <Col>
    //                   <Typography>
    //                     <Button
    //                       onClick={onPresentDeposit}
    //                       variant="contained"
    //                       style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //                     >
    //                       Deposit 2
    //                     </Button>
    //                   </Typography>
    //                 </Col>
    //                 <Col>
    //                   <Typography>
    //                     <Button
    //                       onClick={onPresentWithdraw}
    //                       variant="contained"
    //                       style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //                     >
    //                       Withdraw
    //                     </Button>
    //                   </Typography>
    //                 </Col>
    //                 <Col>
    //                   <Button
    //                     onClick={onRedeem}
    //                     variant="contained"
    //                     style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //                   >
    //                     Claim Reward
    //                   </Button>
    //                 </Col>
    //               </Row>
    //             </div>

    //           </div>
    //         ) : (
    //           <div>
    //             <div>
    //               <Row>
    //                 <Col>
    //                   <Typography>
    //                     <Button
    //                       onClick={onPresentDeposit}
    //                       variant="contained"
    //                       style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //                     >
    //                       Deposit 2
    //                     </Button>
    //                   </Typography>
    //                 </Col>
    //                 <Col>
    //                   <Typography>
    //                     <Button
    //                       onClick={onPresentWithdraw}
    //                       variant="contained"
    //                       style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //                     >
    //                       Withdraw
    //                     </Button>
    //                   </Typography>
    //                 </Col>
    //                 <Col>
    //                   <Button
    //                     onClick={onRedeem}
    //                     variant="contained"
    //                     style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
    //                   >
    //                     Claim Reward
    //                   </Button>
    //                 </Col>
    //               </Row>
    //             </div>
    //           </div>
    //           )};

    // )};

    // ) : (
    //   <UnlockWallet />
    // )}
    // ;
    // </div>

    <div>
      <div>
        {!!account ? (
          <div>
            <div>
              {!!(finalData.depositTokenName === 'BOMB-BSHARE-LP') ? (
                <div>
                  {' '}
                  <div>
                    {' '}
                    <div>
                      <Button
                        onClick={onPresentDeposit}
                        variant="contained"
                        style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                      >
                        deposit
                      </Button>
                    </div>
                    <br />
                    <div>
                      <Typography>
                        <Button
                          onClick={onPresentWithdraw}
                          variant="contained"
                          style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                        >
                          withdraw
                        </Button>
                      </Typography>
                    </div>
                    <br />
                    <div>
                      <Typography>
                        <Button
                          onClick={onRedeemBank}
                          variant="contained"
                          style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                        >
                          Claim
                        </Button>
                      </Typography>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {!!(finalData.depositTokenName === 'BOMB-BTCB-LP') ? (
                    <div>
                      <div>
                        <div>
                          <Row>
                            <Col>
                              <Typography>
                                <Button
                                  onClick={onPresentDeposit}
                                  variant="contained"
                                  style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                                >
                                  Deposit
                                </Button>
                              </Typography>
                            </Col>
                            <Col>
                              <Typography>
                                <Button
                                  onClick={onPresentWithdraw}
                                  variant="contained"
                                  style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                                >
                                  Withdraw
                                </Button>
                              </Typography>
                            </Col>
                            <Col>
                              <Button
                                onClick={onRedeem}
                                variant="contained"
                                style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                              >
                                Claim
                              </Button>
                            </Col>
                          </Row>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {!!(finalData.depositTokenName === 'BSHARE-BNB-LP') ? (
                        <div>
                          <div>
                            <div>
                              <Row>
                                <Col>
                                  <Typography>
                                    <Button
                                      onClick={onPresentDeposit}
                                      variant="contained"
                                      style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                                    >
                                      Deposit
                                    </Button>
                                  </Typography>
                                </Col>
                                <Col>
                                  <Typography>
                                    <Button
                                      onClick={onPresentWithdraw}
                                      variant="contained"
                                      style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                                    >
                                      Withdraw
                                    </Button>
                                  </Typography>
                                </Col>
                                <Col>
                                  <Button
                                    onClick={onRedeem}
                                    variant="contained"
                                    style={{ boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.3)' }}
                                  >
                                    Claim
                                  </Button>
                                </Col>
                              </Row>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <UnlockWallet />
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalHelper;
