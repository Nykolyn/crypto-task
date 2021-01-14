/* eslint-disabl */
import React, { useState, useEffect } from 'react';
import * as bitcoin from 'bitcoinjs-lib';
import QRCode from 'qrcode';
import { Box, Typography, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import bip38 from 'bip38';
import wif from 'wif';
import { useLocation, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import Button from './Button';

interface ILocationState {
  secretWord?: string;
}

interface IKey {
  key: string;
  qr: string;
}

interface IAddress {
  address: string;
  qr: string;
}

interface ISnackbarOptions {
  visible: boolean;
  status: 'success' | 'error';
}

const qrImageSample = 'https://anton.shevchuk.name/wp-content/uploads/2008/08/qrcode.png';

const Info: React.FunctionComponent = () => {
  const [keyPair, setKeyPair] = useState<bitcoin.ECPairInterface | null>(null);
  const [privateKey, setPrivateKey] = useState<IKey | null>(null);
  const [legacyAddress, setLegacyAddress] = useState<IAddress | null>(null);
  const [segwitAddress, setSegwitAddress] = useState<IAddress | null>(null);
  const [snackbarOptions, setSnackbarOptions] = useState<ISnackbarOptions>({ visible: false, status: 'success' });

  const location = useLocation<ILocationState>();
  const history = useHistory();

  const secretWord = location.state.secretWord;

  if (!secretWord) {
    history.replace('/form');
    return null;
  }

  useEffect(() => {
    setKeyPair(bitcoin.ECPair.makeRandom());
  }, []);

  useEffect(() => {
    if (!keyPair) return;

    const generateWalletInfo = async () => {
      const decoded = wif.decode(keyPair.toWIF());
      const encryptedKey = bip38.encrypt(decoded.privateKey, decoded.compressed, secretWord);

      setPrivateKey({
        key: encryptedKey,
        qr: await QRCode.toDataURL(keyPair.toWIF()),
      });

      const P2PKHAddress: any = bitcoin.payments.p2pkh({
        pubkey: keyPair.publicKey,
      });
      const P2WPKHAddress: any = bitcoin.payments.p2wpkh({
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

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    document.body.removeChild(textArea);
  };

  const copyTextToClipboard = async (text: string) => {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setSnackbarOptions({ visible: true, status: 'success' });
    } catch (e) {
      setSnackbarOptions({ visible: true, status: 'error' });
    }
  };

  const handleCopyQrKey = (e: React.MouseEvent<HTMLButtonElement>) => {
    const key: string | undefined = e.currentTarget.dataset.key;
    if (!key) return;
    copyTextToClipboard(key);
  };

  return (
    <Box position="relative">
      <Typography align="center" variant="h4">
        Successfully generated bitcoin payment address keys
      </Typography>
      <Box pt={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography>Your Private bitcoin key:</Typography>
          <StyledImage isLoading={!privateKey?.qr} src={privateKey?.qr ? privateKey.qr : qrImageSample} />
          <Button
            variant="contained"
            color="primary"
            data-key={privateKey?.key}
            disabled={!privateKey?.qr}
            onClick={handleCopyQrKey}
          >
            Copy
          </Button>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography>Your legacy address key:</Typography>
          <StyledImage isLoading={!legacyAddress?.qr} src={legacyAddress?.qr ? legacyAddress.qr : qrImageSample} />
          <Button
            variant="contained"
            color="primary"
            data-key={legacyAddress?.address}
            disabled={!privateKey?.qr}
            onClick={handleCopyQrKey}
          >
            Copy
          </Button>
        </Box>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Typography>Your segwit address:</Typography>
          <StyledImage isLoading={!segwitAddress?.qr} src={segwitAddress?.qr ? segwitAddress.qr : qrImageSample} />
          <Button
            variant="contained"
            color="primary"
            data-key={segwitAddress?.address}
            disabled={!privateKey?.qr}
            onClick={handleCopyQrKey}
          >
            Copy
          </Button>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOptions.visible}
        autoHideDuration={2000}
        onClose={() => setSnackbarOptions({ visible: false, status: snackbarOptions.status })}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOptions({ visible: false, status: snackbarOptions.status })}
          severity={snackbarOptions.status}
        >
          {snackbarOptions.status === 'success' ? 'Copied' : 'Failed to copy.'}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

interface IImageProps {
  readonly isLoading: boolean;
}

const StyledImage = styled.img<IImageProps>`
  width: 200px;
  height: 200px;
  transition: all 0.2s;
  filter: blur(${({ isLoading }) => (isLoading ? 0.5 : 0)});
`;

export default Info;
