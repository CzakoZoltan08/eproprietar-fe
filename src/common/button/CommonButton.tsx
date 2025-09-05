"use client";

import Button, { ButtonProps } from "@mui/material/Button";

import NextLink from "next/link";
import React from "react";

/**
 * CommonButton accepts all MUI ButtonProps.
 * If `href` is provided, it renders as a Next.js Link button.
 * Use children as the label (or `text` for backward-compat).
 */
export type CommonButtonProps = ButtonProps & {
  href?: string;
  text?: string; // backward-compat if you previously used `text` instead of children
};

export const CommonButton: React.FC<CommonButtonProps> = ({
  href,
  text,
  children,
  sx,
  ...btnProps
}) => {
  const content = text ?? children;

  if (href) {
    return (
      <Button
        {...btnProps}
        component={NextLink as any}
        href={href}
        sx={{ textDecoration: "none", ...sx }}
      >
        {content}
      </Button>
    );
  }

  return (
    <Button {...btnProps} sx={{ ...sx }}>
      {content}
    </Button>
  );
};