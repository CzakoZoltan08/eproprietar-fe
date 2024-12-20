import { useEffect, useState } from "react";

import styled from "styled-components";

const LogoContainer = styled.div<{ $isDesktop: boolean }>`
  width: ${(props) => (props.$isDesktop ? "250px" : "50%")};
  aspect-ratio: 5 / 2; /* Maintain logo's aspect ratio */
  max-width: 100%;
  position: relative; /* Required for Next.js Image with 'fill' */
`;

type ResponsiveLogoContainerProps = {
    isDesktop: boolean;         // Indicates if the current screen size is desktop
    children: React.ReactNode;  // Represents the child components nested within
  };

export const ResponsiveLogoContainer = ({
    isDesktop,
    children,
  }: ResponsiveLogoContainerProps) => {
    const [hydrated, setHydrated] = useState(false);
  
    useEffect(() => {
      setHydrated(true);
    }, []);
  
    // Render an empty container if not hydrated to avoid mismatch
    return (
      <LogoContainer $isDesktop={isDesktop}>
        {hydrated ? children : null}
      </LogoContainer>
    );
  };
  

