import React, { useState, useEffect } from 'react';
import { Box, Button } from './design';
import styled from '@emotion/styled-base';
import theme from './theme';

const LOCALSTORAGE_COOKIE_DISMISSAL_KEY = 'TT_COOKIES_DISMISSED';

const CookieFooterContainer = styled(Box)`
  position: fixed;
  bottom: 0;
  border-top: 1px solid ${theme.colors.brand};
  display: flex;
  align-items: center;
  justify-content: center;
`;

function CookieFooter() {
  const isCookieAgreementDismissedInitial = () =>
    JSON.parse(
      window.localStorage.getItem(LOCALSTORAGE_COOKIE_DISMISSAL_KEY) || 'false'
    );
  const [isCookieAgreementDismissed, setCookieAgreementDismissed] = useState(
    isCookieAgreementDismissedInitial
  );
  useEffect(() => {
    window.localStorage.setItem(
      LOCALSTORAGE_COOKIE_DISMISSAL_KEY,
      JSON.stringify(isCookieAgreementDismissed)
    );
  }, [isCookieAgreementDismissed]);
  return !isCookieAgreementDismissed ? (
    <CookieFooterContainer
      color="almostWhite"
      bg="darkGray"
      p={2}
      fontSize={1}
      width={1}
      mx="auto"
    >
      <Box mx={3}>
        This website uses third-party cookies to analyze site traffic. By
        continuing to use this site you agree to its use of cookies.
      </Box>
      <Button
        onClick={() => {
          setCookieAgreementDismissed(true);
        }}
      >
        OK
      </Button>
    </CookieFooterContainer>
  ) : null;
}

export default CookieFooter;
