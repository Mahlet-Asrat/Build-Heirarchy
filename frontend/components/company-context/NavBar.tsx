"use client";

import { useRouter } from "next/navigation";
import { Drawer, Menu, Button, Title, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconUser, IconMail, IconNotes, IconLogout, IconMenu2, IconHierarchy2, IconTable, IconHome, IconSettings } from "@tabler/icons-react";
import { useCompanyInfo } from "./companyContext";

const NavBar = () => {
  const { company } = useCompanyInfo();
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false); // Drawer state

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (

    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">

      <Button onClick={open} unstyled className="hover:bg-gray-700 p-2 rounded-full">
        <IconMenu2 size={24} />
      </Button>

      <Drawer opened={opened}onClose={close} position="left" size= {`xs`}  className="bg-gray-800 text-white" overlayProps={{ opacity: 0.5, blur: 4 }}>
        
        <div className="p-4 space-y-6 text-black font-bold text-xl">

        <a href="/dashboard" className="flex items-center space-x-2 hover:text-green-600">
        <IconHome size={24} />
        <span>Home</span>
      </a>
      <a href="/all-positions" className="flex items-center space-x-2 hover:text-green-600">
        <IconTable size={24} />
        <span>Positions Table</span>
      </a>

      <a href="/tree" className="flex items-center space-x-2 hover:text-green-600">
        <IconHierarchy2 size={24} />
        <span>Hierarchy</span>
      </a>

      <a href="/" className="flex items-center space-x-2 hover:text-green-600">
        <IconSettings size={24} />
        <span>Settings</span>
      </a>
        </div>
        
      </Drawer>

      {company && (
      <Box className="flex  justify-end items-center gap-1.5">
        <Menu shadow="md" width={300}>
          <Menu.Target>
            <Button unstyled className="hover:bg-gray-700 p-2 rounded-full">
              <svg
                width="40px"
                height="40px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#ffffff"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    opacity="0.4"
                    d="M12.1207 12.78C12.0507 12.77 11.9607 12.77 11.8807 12.78C10.1207 12.72 8.7207 11.28 8.7207 9.50998C8.7207 7.69998 10.1807 6.22998 12.0007 6.22998C13.8107 6.22998 15.2807 7.69998 15.2807 9.50998C15.2707 11.28 13.8807 12.72 12.1207 12.78Z"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    opacity="0.34"
                    d="M18.7398 19.3801C16.9598 21.0101 14.5998 22.0001 11.9998 22.0001C9.39977 22.0001 7.03977 21.0101 5.25977 19.3801C5.35977 18.4401 5.95977 17.5201 7.02977 16.8001C9.76977 14.9801 14.2498 14.9801 16.9698 16.8001C18.0398 17.5201 18.6398 18.4401 18.7398 19.3801Z"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </g>
              </svg>
            </Button>
          </Menu.Target>
          

          <Menu.Dropdown className="bg-gray-800 text-white rounded-lg shadow-lg p-4">
            <Menu.Label className="text-center text-blue-200">Company Info</Menu.Label>
            <Menu.Item leftSection={<IconUser size={14} />} className="text font-extrabold">
              <span className="font-bold mr-0.5">Name:</span> {company.name}
            </Menu.Item>
            <Menu.Item leftSection={<IconMail size={14} />} className="text-sm text-gray-300">
              <span className="font-bold mr-0.5">Email:</span> {company.email}
            </Menu.Item>
            <Menu.Item leftSection={<IconNotes size={14} />} className="text-xs text-gray-400">
              <span className="font-bold mr-0.5">Description:</span> {company.description || "No description available"}
            </Menu.Item>
            <Menu.Divider />

            <Menu.Item leftSection={<IconLogout size={14} />} color="red"  onClick={handleLogout}
              className="text-left text-red-700 font-extrabold hover:bg-gray-700 p-2 rounded"
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Title order={3}> Build Heirarchy </Title>
        </Box>
      )}
      {/* <main> {children}</main> */}
    </header>
  );
};

export default NavBar;