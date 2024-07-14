"use client"
import AppContext from "@/app/Context/AppContext";
import { Button, Drawer, Flex } from "@mantine/core";
import { useContext } from "react";

interface CustomDrawerProps {
  opened: boolean;
  onRequestClose: () => void;
  submitForm?: () => void;
  content: any;
  isLoading?: boolean;
  withHeader: boolean
  customDrawerSize?: any
};

const CustomDrawer = ({ opened, onRequestClose, submitForm, content, isLoading, withHeader, customDrawerSize }: CustomDrawerProps) => {

  const { isMobile }: { isMobile: boolean } = useContext(AppContext)
  return (

    <Drawer.Root
      id="CustomDrawerMantine"
      opened={opened}
      position="right"
      size={isMobile ? "100%" : customDrawerSize ? customDrawerSize : "75%"}
      onClose={onRequestClose}
    >
      <Drawer.Overlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }} />
      <Drawer.Content bg={"#F1F2F4"}>
        {withHeader && (
          <Drawer.Header bg={'#363636'} h={"50px"} mb={20}>
            <Flex align={"center"} justify={"flex-end"} w={"100%"}>
              <Button
                size="md"
                variant="outline"
                loading={isLoading}
                color="red"
                onClick={onRequestClose}
                mr={15}
                style={{ color: "white" }}
              >
                Annuler
              </Button>
              <Button
                size="md"
                variant="outline"
                color="green"
                type="submit"
                loading={isLoading}
                style={{ color: "white" }}
                onClick={submitForm}
              >
                Enregistrer
              </Button>
            </Flex>
          </Drawer.Header>
        )}
        <Drawer.Body pt={0}>
          {content}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
};

export default CustomDrawer;