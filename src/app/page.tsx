'use client'
import { useState } from "react";
import CustomDrawer from "@/_components/CustomDrawer";
import { Button, Title } from "@mantine/core";
import AddOpeningHours from "./OpeningHours/AddOpeningHours";


export default function Home() {

  const [opened, setOpened] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div>
      <Title style={{color:'#fff'}}>Welcome to this page</Title>
      <Button onClick={() => setOpened(true)}>open drawer</Button>
      <CustomDrawer
        opened={opened}
        onRequestClose={() => setOpened(!opened)}
        isLoading={isLoading}
        withHeader={true}
        content={
        <AddOpeningHours 
        onRequestClose={() => setOpened(false)}
        />
      }
      />
    </div>

  );
};