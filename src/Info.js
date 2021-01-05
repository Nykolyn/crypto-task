import { useState, useEffect } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import styled from 'styled-components';
import QRCode from 'qrcode';
import { Box, Typography } from '@material-ui/core';
import bip38 from 'bip38';
import wif from 'wif';
import { useLocation, useHistory } from 'react-router-dom';

const Info = () => {
  const [keyPair, setKeyPair] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [legacyAddress, setLegacyAddress] = useState(null);
  const [segwitAddress, setSegwitAddress] = useState(null);

  const location = useLocation();
  const history = useHistory();
  const secretWord = location.state?.secretWord;
  console.log('secretWord', secretWord);
  if (!secretWord) history.replace('/form');

  useEffect(() => {
    setKeyPair(bitcoin.ECPair.makeRandom());
  }, []);

  useEffect(() => {
    if (!keyPair) return;

    const generateWalletInfo = async () => {
      const decoded = wif.decode(keyPair.toWIF());
      const encryptedKey = bip38.encrypt(
        decoded.privateKey,
        decoded.compressed,
        secretWord
      );

      setPrivateKey({
        key: encryptedKey,
        qr: await QRCode.toDataURL(keyPair.toWIF()),
      });

      const P2PKHAddress = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
      });
      const P2WPKHAddress = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
      });

      setLegacyAddress({
        address: P2PKHAddress.address,
        qr: await QRCode.toDataURL(P2PKHAddress.address),
      });
      setSegwitAddress({
        address: P2WPKHAddress.address,
        qr: await QRCode.toDataURL(P2WPKHAddress.address),
      });
    };

    generateWalletInfo();
  }, [keyPair]);

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography>{privateKey?.key}</Typography>
        <StyledImage src={privateKey?.qr} />
      </Box>
      <Box display="flex" alignItems="center">
        <Typography>{legacyAddress?.address}</Typography>
        <StyledImage src={legacyAddress?.qr} />
      </Box>
      <Box display="flex" alignItems="center">
        <Typography>{segwitAddress?.address}</Typography>
        <StyledImage src={segwitAddress?.qr} />
      </Box>
    </Box>
  );
};

const StyledImage = styled.img`
  /* width: 100px;
  height: 100px;
  display: block; */
`;

export default Info;
