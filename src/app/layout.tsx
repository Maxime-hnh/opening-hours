"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "@mantine/notifications/styles.css";
import {
  AppShellHeader,
  AppShellMain,
  AppShellNavbar,
  ColorSchemeScript,
  createTheme,
  MantineProvider
} from '@mantine/core';
import { AppShell, Burger, Group, Image, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import classes from './ui/home.module.scss';
import React from "react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });


const themeMantine = createTheme({
  autoContrast: true
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

  const [opened, { toggle }] = useDisclosure();

  return (
    <html lang="fr">
      <head>
        <title>OG-Tickets</title>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={themeMantine}>
          <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { desktop: true, mobile: !opened } }}
            padding="md"
          >
            <AppShellHeader>
              <Group h="100%" px="md">
                <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                <Group justify="space-between" style={{ flex: 1 }}>
                  <Image
                    radius={'xs'}
                    w={"48px"}
                    src="/logo.png"
                    alt="logo"
                  />
                  <Group ml="xl" gap={0} visibleFrom="sm">
                    <Link href={"/"}>
                      <UnstyledButton className={classes.control}>Home</UnstyledButton>
                    </Link>
                    <Link href={"/dashboard"}>
                      <UnstyledButton className={classes.control}>Dashboard</UnstyledButton>
                    </Link>
                    <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
                    <UnstyledButton className={classes.control}>Support</UnstyledButton>
                  </Group>
                </Group>
              </Group>
            </AppShellHeader>

            <AppShellNavbar py="md" px={4}>
              <UnstyledButton className={classes.control}>Home</UnstyledButton>
              <UnstyledButton className={classes.control}>Blog</UnstyledButton>
              <UnstyledButton className={classes.control}>Contacts</UnstyledButton>
              <UnstyledButton className={classes.control}>Support</UnstyledButton>
            </AppShellNavbar>

            <AppShellMain>
              {children}
            </AppShellMain>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
